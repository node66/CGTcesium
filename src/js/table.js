import {viewer} from '../index';
import * as Cesium from 'cesium';

let id = 0;
export {
  id,
};

export function addRow(filename) {
  const headerCart = document.getElementById('sideBar');
  const div = document.createElement('div');
  div.innerHTML =
      `<div class="card" id="card${id}">
            <div class="card-header">
                <input className="form-check-input me-1" checked type="checkbox" id="check${id}" value="">
                <label for="check${id}">${filename}</label>
            </div>
                <ul id="list${id}" class="list-group list-group-flush">
                </ul>
       </div>`;

  headerCart.insertBefore(div, document.getElementById('first'));

  const bodyCard = document.getElementById(`list${id}`);
  bodyCard.innerHTML =
      `<li class="list-group-item">
            <input id="sizeInput${id}" type="number" min="0" required value="10">
            <label for="connectPoints${id}">Connect Points</label>
      </li>
      <li class="list-group-item">
            <input  class="form-check-input" id="connectPoints${id}" type="checkbox" value="">
            Connect Points
      </li>
      <li class="list-group-item">
            <input type="color" class="form-control form-control-color" id="colorInput${id}" value="#FFFFFF">
            <label for="colorInput${id}" class="form-label">Item Color</label>
      </li>
      <li class="list-group-item">
           <label for="pngFile${id}" class="form-label">
            <canvas id="canvas${id}" width="32" height="32" style="border:1px solid #000000">
            </canvas><input class="form-control" accept=".png" type="file" id="pngFile${id}">
                Texture Image
           </label>
           <input class="form-control" accept=".png" type="file" id="pngFile${id}">
      </li>
      <li class="list-group-item">
            <div class="card">
                <ul id="innerList${id}" class="list-group list-group-flush">
                <li class="list-group-item">
                        <input className="form-check-input me-1" id="bufferCheck${id}" type="checkbox" value="">
                        <label for="">3D buffer</label>
                </li>
                 <li class="list-group-item">
                 <label for="">3D buffer size</label>
                        <div class="form-check">
                            <input  class="form-check-input" type="radio" name="flexRadioDefault" id="sizeBuff1" checked>
                            <label class="form-check-label" for="sizeBuff1">
                                3nm
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="sizeBuff2">
                            <label class="form-check-label" for="sizeBuff2">
                                5nm
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="sizeBuff3">
                            <label class="form-check-label" for="sizeBuff3">
                                10nm
                            </label>
                        </div>
                         
                 </li>
                <li class="list-group-item">
                         <label for="colorInput${id}" class="form-label">3D buffer color</label>
                        <input type="color" class="form-control form-control-color" id="colorBuffInput${id}" value="#FFFFFF">
                </li>
                <li class="list-group-item">
                       <input id="opacityBuffInput${id}" step="0.1" type="number" min="0" required value="0.5">
                       <label for="opacityBuffInput${id}" class="form-label">3D buffer color opacity</label>
                </li>
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
        pixelSize: new Cesium.CallbackProperty(
            () => {
              return sizeInp.value;
            }, false,
        ),
        color: new Cesium.CallbackProperty(
            () => {
              return Cesium.Color.fromCssColorString(
                  colorInp.value);
            }, false,
        ),
      };
    });
  }

  const checkBox = document.getElementById(`check${id}`);
  checkBox.addEventListener('change',
      () => {
        const [data] = viewer.dataSources.getByName(filename);
        const checked = checkBox.checked;
        data.show = checked;
        const polyline = viewer.entities.getById(filename)?.polyline;
        if (polyline !== undefined)
          if (checked) {
            polyline.show = !!polyCheck.checked;
          } else
            polyline.show = false;
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

  polyCheck.addEventListener('change',
      () => {
        let cartesians = [];
        const [data] = viewer.dataSources.getByName(filename);
        data.entities.values.forEach(entity => {
          cartesians.push(entity.position.getValue(Cesium.JulianDate.now()));
        });
        const polyline = viewer.entities.getById(filename)?.polyline;
        if (polyline === undefined)
          viewer.entities.add({
            id: filename,
            polyline: {
              positions: cartesians,
              arcType: Cesium.ArcType.NONE,
              width: 2,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.CallbackProperty(
                    () => {
                      return Cesium.Color.fromCssColorString(
                          colorInp.value);
                    }, false,
                ),
              }),
            },
          });
        else
          polyline.show = !!(polyCheck.checked && checkBox.checked);
      });

  const checkBuffBox = document.getElementById(`bufferCheck${id}`);
  checkBuffBox.onchange =
      () => {
        const [data] = viewer.dataSources.getByName(filename);
        const checked = checkBuffBox.checked;
        data.entities.values.forEach(entity => {
          entity.ellipsoid.show = checked;
        });
      };

  const colorBuffInp = document.getElementById(`colorBuffInput${id}`);
  const opacityBuffInp = document.getElementById(`opacityBuffInput${id}`);
  opacityBuffInp.onclick = sizeAndColorBuffChange;
  colorBuffInp.onclick = colorBuffInp.onchange = sizeAndColorBuffChange;

  function sizeAndColorBuffChange() {
    const [data] = viewer.dataSources.getByName(filename);
    data.entities.values.forEach(entity => {
          entity.ellipsoid.material = Cesium.Color.fromCssColorString(
              colorBuffInp.value).withAlpha(Number(opacityBuffInp.value));
        },
    );
  }

  const sizeBuff1 = document.getElementById(`sizeBuff1`);
  const sizeBuff2 = document.getElementById(`sizeBuff2`);
  const sizeBuff3 = document.getElementById(`sizeBuff3`);

  sizeBuff1.onchange = () => {
    const [data] = viewer.dataSources.getByName(filename);
    data.entities.values.forEach(entity => {
      entity.ellipsoid.radii = new Cesium.Cartesian3(5556, 5556, //3nm
          5556);
    });
  };
  sizeBuff2.onchange = () => {
    const [data] = viewer.dataSources.getByName(filename);
    data.entities.values.forEach(entity => {
      entity.ellipsoid.radii = new Cesium.Cartesian3(9260, 9260, //5nm
          9260);
    });
  };
  sizeBuff3.onchange = () => {
    const [data] = viewer.dataSources.getByName(filename);
    data.entities.values.forEach(entity => {
      entity.ellipsoid.radii = new Cesium.Cartesian3(18520, 18520,//10nm
          18520);
    });
  };

  id++;
}

const deleteItems = document.getElementById('deleteItems');
deleteItems.onclick = () => {

};