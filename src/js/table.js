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
        `<input checked class="form-check-input" id="check${id}" name="checkbox" type="checkbox" value="">`


    const checkBox = document.getElementById(`check${id}`)
    checkBox.addEventListener("change",
        () => {
            const [data] = viewer.dataSources.getByName(filename);
            const checked = checkBox.checked
            data.show = checked
            const polyline = viewer.entities.getById(filename)?.polyline
            if (polyline !== undefined)
                if (checked) {
                    polyline.show = !!polyCheck.checked;
                } else
                    polyline.show = false
        })

    const mainCheck = document.getElementById("mainСheckbox")
    mainCheck.disabled = false;
    mainCheck.checked = true;
    mainCheck.addEventListener("change",
        () => {
            const rowCount = tableObject.rows.length;
            for (let i = 1; i < rowCount; ++i) {
                const row = tableObject.rows[i];
                const [chkbox] = row.cells[0].getElementsByTagName('input');
                chkbox.checked = mainCheck.checked
            }
        }
    )


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


    const poly = newRow.insertCell();
    poly.innerHTML =
        `<input  class="form-check-input" id="connectPoints${id}" type="checkbox" value="">`

    const polyCheck = document.getElementById(`connectPoints${id}`)


    polyCheck.addEventListener("change",
        () => {
            let cartesians = []
            const [data] = viewer.dataSources.getByName(nameCell.innerHTML);
            data.entities.values.forEach(entity => {
                cartesians.push(entity.position.getValue(Cesium.JulianDate.now()))
            });
            const polyline = viewer.entities.getById(nameCell.innerHTML)?.polyline
            if (polyline === undefined)
                viewer.entities.add({
                    id: nameCell.innerHTML,
                    polyline: {
                        positions: cartesians,
                        arcType: Cesium.ArcType.NONE,
                        width: 2,
                        material: new Cesium.PolylineOutlineMaterialProperty({
                            color: new Cesium.CallbackProperty(
                                () => {
                                    return Cesium.Color.fromCssColorString(
                                        colorInp.value);
                                }, false
                            ),
                        }),
                    }
                })
            else
                polyline.show = !!(polyCheck.checked && checkBox.checked);
        })


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