import 'bootstrap';

import * as Cesium from 'cesium';
import {Viewer} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import '../src/css/main.css';
import {addRow} from './js/table';

export const viewer = new Viewer('cesiumContainer');
export const scene = viewer.scene;

const ellipsoid = scene.globe.ellipsoid;

const strToFloat = (str) => {
  return parseFloat(str.replace(',', '.'));
};

const fileInput = document.getElementById('geojson-file-upload');
fileInput.onchange = () => {
  const files = fileInput.files;

  Object.keys(files).forEach(i => {
    const file = files[i];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      Cesium.GeoJsonDataSource.load(JSON.parse(e.target.result)).
          then(dataSource => {
            dataSource.name = file.name;
            const [data] = viewer.dataSources.getByName(file.name);
            if (viewer.dataSources.contains(data)) return;

            addRow(file.name);
            viewer.dataSources.add(dataSource).then(r => {
              r.entities.values.forEach(entity => {
                const cartographic = Cesium.Cartographic.fromCartesian(
                    entity.position.getValue(Cesium.JulianDate.now()));
                entity.billboard = undefined; //show only points
                entity.point = {
                  pixelSize: 10,
                };

                cartographic.height = strToFloat(
                    String(entity.properties.Altitude));
                entity.position = Cesium.Cartesian3.fromDegrees(
                    cartographic.longitude * Cesium.Math.DEGREES_PER_RADIAN,
                    cartographic.latitude * Cesium.Math.DEGREES_PER_RADIAN,
                    cartographic.height * Cesium.Math.DEGREES_PER_RADIAN,
                    ellipsoid);

                entity.ellipsoid = {
                  radii: new Cesium.Cartesian3(150000.0, 150000.0, 150000.0),
                  material: Cesium.Color.RED.withAlpha(0.0),
                };

              });
              viewer.zoomTo(r).catch(error => alert(error));
            }).catch(error => alert(error));
          }).
          catch(error => alert(error));
    };
    reader.onerror = () => alert(reader.error);
  });
};
