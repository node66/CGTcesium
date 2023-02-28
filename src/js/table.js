import {viewer} from '../index';
import * as Cesium from 'cesium';

let id = 0;
export {
  id,
};

export function addRow(filename) {
  const headerCart = document.getElementById('sideBar');
  const div = document.createElement('div');
  div.innerHTML = `<div class="card" id="card${id}">
            <div class="card-header">
                <input checked type="checkbox" id="check${id}" value="">
                <label for="check${id}">${filename}</label>
            </div>
                <ul id="list${id}" class="list-group list-group-flush">
                </ul>
       </div>`;

  headerCart.prepend(div);

  const bodyCard = document.getElementById(`list${id}`);
  // language=HTML format=false
  bodyCard.innerHTML = `
      <li class="list-group-item">
          <input id="sizeInput${id}" type="number" min="0" required value="10">
          <label for="size${id}">Size</label>
      </li>
      <li class="list-group-item">
          <input class="form-check-input" id="connectPoints${id}"
                 type="checkbox" value="">
          <label for="connectPoints${id}">Connect Points</label>
      </li>
      <li class="list-group-item">
          <input type="color" class="form-control form-control-color"
                 id="colorInput${id}" value="#FFFFFF">
          <label for="colorInput${id}" class="form-label">Item Color</label>
      </li>
      <li class="list-group-item">
          <label for="pngFile${id}" class="form-label">
              <canvas id="canvas${id}" width="32" height="32"
                      style="border:1px solid #000000">
              </canvas>
              <input class="form-control" accept=".png" type="file"
                     id="pngFile${id}">
              Texture Image
          </label>
          <input class="form-control" accept=".png" type="file"
                 id="pngFile${id}">
      </li>
      <li class="list-group-item">
          <div class="card">
              <ul id="innerList${id}" class="list-group list-group-flush">
                  <li class="list-group-item">
                      <input id="bufferCheck${id}" type="checkbox" value="">
                      <label for="">3D buffer</label>
                  </li>
                  <li class="list-group-item">
                      <table class="table">
                          <tbody>
                          <td>3D buffer size</td>
                          <td>3D buffer color</td>
                          <td>3D buffer transparency</td>
                          <tr>
                              <td>
                                  <input class="form-check-input"
                                         type="checkbox" name="flexCheckDefault"
                                         id="checkBuff1Box-${id}" checked>
                                  <label class="form-check-label"
                                         for="checkBuff1Box-${id}"> 3nm </label>
                              </td>
                              <td>
                                  <input type="color"
                                         class="form-control form-control-color"
                                         id="colorBuffInput1-${id}" value="#FFFFFF">
                              </td>
                              <td>
                                  <input id="transparencyBuffInput1-${id}" step="0.1" type="number" min="0" max="1" required value="0.5">
                              </td>
                          </tr>

                          <tr>
                              <td>
                                  <input class="form-check-input"
                                         type="checkbox" name="flexCheckDefault"
                                         id="checkBuff2Box-${id}" checked>
                                  <label class="form-check-label"
                                         for="checkBuff2Box-${id}"> 5nm </label>
                              </td>
                              <td>
                                  <input type="color"
                                         class="form-control form-control-color"
                                         id="colorBuffInput2-${id}" value="#FFFFFF">
                              </td>
                              <td>
                                <input id="transparencyBuffInput2-${id}" step="0.1" type="number" min="0" max="1" required value="0.5">
                              </td>
                          </tr>

                          <tr>
                              <td>
                                  <input class="form-check-input"
                                         type="checkbox" name="flexCheckDefault"
                                         id="checkBuff3Box-${id}" checked>
                                  <label class="form-check-label"
                                         for="checkBuff3Box-${id}"> 10nm </label>
                              </td>
                              <td>
                                  <input type="color"
                                         class="form-control form-control-color"
                                         id="colorBuffInput3-${id}" value="#FFFFFF">
                              </td>
                              <td>
                                  <input id="transparencyBuffInput3-${id}" step="0.1" type="number" min="0" max="1" required value="0.5">
                              </td>
                          </tr>
                          </tbody>
                      </table>
              </ul>
          </div>
      </li>`;

  const sizeInp = document.getElementById(`sizeInput${id}`);
  sizeInp.onchange = sizeInp.onclick = sizeAndColorChange;

  const colorInp = document.getElementById(`colorInput${id}`);
  colorInp.onclick = sizeAndColorChange;

  function sizeAndColorChange() {
    const [data] = viewer.dataSources.getByName(filename);
    data.entities.values.forEach(entity => {
      entity.point = {
        pixelSize: new Cesium.CallbackProperty(() => {
          return sizeInp.value;
        }, false),
        color: new Cesium.CallbackProperty(() => {
          return Cesium.Color.fromCssColorString(colorInp.value);
        }, false),
      };
    });
  }

  const checkBox = document.getElementById(`check${id}`);
  checkBox.addEventListener('change', () => {
    const [data] = viewer.dataSources.getByName(filename);
    const checked = checkBox.checked;
    data.show = checked;
    const polyline = viewer.entities.getById(filename)?.polyline;
    if (polyline !== undefined) if (checked) {
      polyline.show = !!polyCheck.checked;
    } else polyline.show = false;
  });

  const imgInp = document.getElementById(`pngFile${id}`);
  const canvas = document.getElementById(`canvas${id}`),
      context = canvas.getContext('2d');

  let path;
  imgInp.onchange = () => {
    const [file] = imgInp.files;
    context.clearRect(0, 0, 32, 32);
    path = URL.createObjectURL(file);
    const img = new Image();
    if (file) {
      img.onload = () => {
        img.style.width = 32;
        img.style.height = 32;
        context.drawImage(img, 0, 0, 32, 32);
      };
      img.src = path;
      const [data] = viewer.dataSources.getByName(filename);
      data.entities.values.forEach(entity => {
        entity.point.show = false;
        entity.billboard = new Cesium.BillboardGraphics({
          image: path,
        });
      });
    }
  };

  const polyCheck = document.getElementById(`connectPoints${id}`);

  polyCheck.addEventListener('change', () => {
    let cartesians = [];
    const [data] = viewer.dataSources.getByName(filename);
    data.entities.values.forEach(entity => {
      cartesians.push(entity.position.getValue(Cesium.JulianDate.now()));
    });

    const polyline = viewer.entities.getById(filename)?.polyline;
    if (polyline === undefined) viewer.entities.add({
      id: filename,
      polyline: {
        positions: cartesians,
        arcType: Cesium.ArcType.NONE,
        width: 2,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: new Cesium.CallbackProperty(() => {
            return Cesium.Color.fromCssColorString(colorInp.value);
          }, false),
        }),
      },
    }); else {
      polyline.show = !!(polyCheck.checked && checkBox.checked);
    }
  });

  const BufferSize = {
    nm3: 5556,
    nm5: 9260,
    nm10: 18520,
  };

  const checkBuffBox = document.getElementById(`bufferCheck${id}`);
  checkBuffBox.onchange = () => {
    const [data] = viewer.dataSources.getByName(filename);
    for (let i = 0; i < data.entities.values.length; i++) {

      if (i === 0 || i === data.entities.values.length - 1 || i % 10 === 0) {
        const cartographic = Cesium.Cartographic.fromCartesian(
            data.entities.values[i].position.getValue(Cesium.JulianDate.now()));

        viewer.entities.add({
          position: data.entities.values[i].position,
          ellipse: {
            semiMinorAxis: BufferSize.nm3,
            semiMajorAxis: BufferSize.nm3,
            height: cartographic.height,
            material: new Cesium.ColorMaterialProperty(
                new Cesium.CallbackProperty(() => {
                  return Cesium.Color.fromCssColorString(colorBuffInp1.value).
                      withAlpha(Number(transparencyBuffInp1.value));
                }, false)),
            show: checkBuffBox1.value,
          },
        });

        viewer.entities.add({
          position: data.entities.values[i].position,
          ellipse: {
            semiMinorAxis: BufferSize.nm5,
            semiMajorAxis: BufferSize.nm5,
            height: cartographic.height,
            material: new Cesium.ColorMaterialProperty(
                new Cesium.CallbackProperty(() => {
                  return Cesium.Color.fromCssColorString(colorBuffInp2.value).
                      withAlpha(Number(transparencyBuffInp2.value));
                }, false)),
          },
        });
        viewer.entities.add({
          position: data.entities.values[i].position,
          ellipse: {
            semiMinorAxis: BufferSize.nm10,
            semiMajorAxis: BufferSize.nm10,
            height: cartographic.height,
            material: new Cesium.ColorMaterialProperty(
                new Cesium.CallbackProperty(() => {
                  return Cesium.Color.fromCssColorString(colorBuffInp3.value).
                      withAlpha(Number(transparencyBuffInp3.value));
                }, false)),
          },
        });
      }

    }
  };

  const checkBuffBox1 = document.getElementById(`checkBuff1Box-${id}`);
  const colorBuffInp1 = document.getElementById(`colorBuffInput1-${id}`);
  const transparencyBuffInp1 = document.getElementById(
      `transparencyBuffInput1-${id}`);

  const colorBuffInp2 = document.getElementById(`colorBuffInput2-${id}`);
  const transparencyBuffInp2 = document.getElementById(
      `transparencyBuffInput2-${id}`);

  const colorBuffInp3 = document.getElementById(`colorBuffInput3-${id}`);
  const transparencyBuffInp3 = document.getElementById(
      `transparencyBuffInput3-${id}`);

  id++;
}

const deleteItems = document.getElementById('deleteItems');
deleteItems.onclick = () => {

};