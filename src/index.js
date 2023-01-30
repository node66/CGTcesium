import "bootstrap";

import { Ion, Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"
import * as Cesium from "cesium";
import {addRow} from "./js/table";

export const viewer = new Viewer('cesiumContainer');
const ellipsoid = viewer.scene.globe.ellipsoid;

const strToFloat = (str) => {
    return parseFloat(str.replace(",", "."));
}

const fileInput = document.getElementById('formFileMultiple');
fileInput.onchange = () => {
    const files = fileInput.files;

    Object.keys(files).forEach( i => {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            Cesium.GeoJsonDataSource.load(JSON.parse(e.target.result))
                .then(dataSource => {
                    viewer.dataSources.add(dataSource);
                    addRow(file.name);
                    dataSource.entities.values.forEach(entity => {
                        //entity.billboard = undefined

                        const downrange = strToFloat(String(entity.properties['Downrange [Ra]'])) * 100;

                        const cartographic = Cesium.Cartographic.fromCartesian(
                            entity.position.getValue(Cesium.JulianDate.now())
                        )

                        cartographic.height = strToFloat(String(entity.properties.Altitude));
                        entity.position = Cesium.Cartesian3.fromDegrees(
                            cartographic.longitude * Cesium.Math.DEGREES_PER_RADIAN,
                            cartographic.latitude * Cesium.Math.DEGREES_PER_RADIAN,
                            cartographic.height * Cesium.Math.DEGREES_PER_RADIAN,
                            ellipsoid,
                        )

                        let color
                        if (downrange === 0) {
                            color = new Cesium.Color(1, 1, 1)
                        } else if (downrange < 0) {
                            color = new Cesium.Color(0 - downrange * 10, 0, 1 + downrange)
                        } else if (downrange > 0) {
                            color = new Cesium.Color(downrange / 10, 0, 1 - (downrange / 10))
                        }

                        entity.ellipsoid = new Cesium.EllipsoidGraphics({
                            radii: new Cesium.Cartesian3(1500.0, 1500.0, 1500.0),
                            material: color,
                            slicePartitions: 24,
                            stackPartitions: 36,
                        })
                    });
                })
                .catch(error => {
                    alert(error);
                })
        }
        reader.onerror = () => {
            alert(reader.error);
        }
    });
}