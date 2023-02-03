import "bootstrap";

import * as Cesium from "cesium";
import {Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"
import {addRow, id} from "./js/table";

export const viewer = new Viewer('cesiumContainer');
const ellipsoid = viewer.scene.globe.ellipsoid;

const strToFloat = (str) => {
    return parseFloat(str.replace(",", "."));
}


const fileInput = document.getElementById("geojson-file-upload");
fileInput.onchange = () => {
    const files = fileInput.files;

    Object.keys(files).forEach(i => {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            Cesium.GeoJsonDataSource.load(JSON.parse(e.target.result))
                .then(dataSource => {
                    dataSource.name = file.name;
                    if (viewer.dataSources.contains(dataSource))
                        return;

                    addRow(file.name);
                    viewer.dataSources.add(dataSource)
                        .then(r => {
                            r.entities.values.forEach(entity => {
                                entity.billboard = undefined

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

                                const colorCallback = new Cesium.CallbackProperty(
                                    () => {
                                            return Cesium.Color.fromRandom()
                                    }, false);

                                entity.ellipsoid = new Cesium.EllipsoidGraphics({
                                    radii: new Cesium.Cartesian3(150000.0, 150000.0, 150000.0),
                                    material: new Cesium.ColorMaterialProperty(colorCallback),
                                    slicePartitions: 24,
                                    stackPartitions: 36,
                                })
                            });
                        })
                        .catch(error => {
                            alert(error)
                        })
                }).catch(error => {
                alert(error);
            })
        }
        reader.onerror = () => {
            alert(reader.error);
        }
    });
}