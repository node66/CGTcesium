import {viewer} from "../index";
import * as Cesium from "cesium";


const tableObject = document.getElementById("table");
let id = 0
export {
    id
}

export function addRow(filename) {
    const newRow = tableObject.insertRow();

    const checkboxCell = newRow.insertCell();
    checkboxCell.innerHTML =
        "<input class=\"form-check-input\" name=\"checkbox\" type=\"checkbox\" value=\"\">\n"


    const nameCell = newRow.insertCell();
    nameCell.innerHTML = filename

    const sizeCell = newRow.insertCell();
    sizeCell.innerHTML =
        `<input id="sizeInput${id}" type="number" min="0" required value="10">`


    const sizeInp = document.getElementById(`sizeInput${id}`);
    sizeInp.onchange = sizeInp.onclick = sizeAndColorChange;


    const colorCell = newRow.insertCell();
    colorCell.innerHTML =
        `<label for="colorInput${id}" class="form-label"></label>` +
        `<input type="color" class="form-control form-control-color" id="colorInput${id}" value="#FFFFFF">`

    const colorInp = document.getElementById(`colorInput${id}`);
    colorInp.onclick = sizeAndColorChange;

    function sizeAndColorChange() {
        const [data] = viewer.dataSources.getByName(nameCell.innerHTML);
        data.entities.values.forEach(entity => {
            entity.point = {
                pixelSize: new Cesium.CallbackProperty(
                    () => {
                        return sizeInp.value;
                    }, false
                ),
                color: new Cesium.CallbackProperty(
                    () => {
                        return Cesium.Color.fromCssColorString(
                            colorInp.value);
                    }, false
                ),
            }
        })
    }


    const imgCell = newRow.insertCell();
    imgCell.innerHTML =
        `<label for="pngFile${id}" class="form-label">
         <canvas id="canvas${id}" width="32" height="32" style="border:1px solid #000000;">
         </canvas><input class="form-control" accept=".png" type="file" id="pngFile${id}" >`

    const imgInp = document.getElementById(`pngFile${id}`);
    const canvas = document.getElementById(`canvas${id}`),
          context = canvas.getContext('2d');

    let path;
    imgInp.onchange = () => {
        const [file] = imgInp.files;
        path = URL.createObjectURL(file);
        const img = new Image();
        if (file) {
            img.onload = () => {
                img.style.width = 32;
                img.style.height = 32;
                context.drawImage(img, 0, 0);
            };
            img.src = path;
            const [data] = viewer.dataSources.getByName(nameCell.innerHTML);
            data.entities.values.forEach(entity => {
                entity.point.show = false;
                entity.billboard = new Cesium.BillboardGraphics({
                    image: path,
                });
            });
        }
    }


    const param = newRow.insertCell();

    id++
}


const deleteItems = document.getElementById("deleteItems")
deleteItems.addEventListener("click", () => {
    const rowCount = tableObject.rows.length;
    for (let i = 1; i < rowCount; ++i) {
        const row = tableObject.rows[i];
        const [chkbox] = row.cells[0].getElementsByTagName('input');
        const dataName = row.cells[1].innerHTML;
        if ('checkbox' === chkbox.type && true === chkbox.checked) {
            tableObject.deleteRow(i);
            const dataSources = viewer.dataSources;
            dataSources.getByName(dataName).forEach(data => {
                dataSources.remove(data, true);
            });
            i--;
            id--;
        }
    }
})