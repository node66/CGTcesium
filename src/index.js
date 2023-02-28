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
                entity.billboard = undefined; //show only points
                entity.point = {
                  pixelSize: 10,
                };

                const cartographic = Cesium.Cartographic.fromCartesian(
                    entity.position.getValue(Cesium.JulianDate.now()));
                cartographic.height = strToFloat(
                    String(entity.properties.Altitude));

                const entityPositionCartographic = new Cesium.Cartographic(
                    cartographic.longitude,
                    cartographic.latitude,
                    cartographic.height);
                entity.position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(
                    entityPositionCartographic);

              });
              viewer.zoomTo(r).catch(error => alert(error));
            }).catch(error => alert(error));
          }).
          catch(error => alert(error));
    };
    reader.onerror = () => alert(reader.error);
  });
};
