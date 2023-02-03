import {viewer} from "../index";

const tableObject = document.getElementById("table")
let id = 0
export {
    id
}

export function addRow(filename) {
    const newRow = tableObject.insertRow();

    const checkboxCell = newRow.insertCell();
    checkboxCell.innerHTML =
        "<input class=\"form-check-input\" type=\"checkbox\" value=\"\">\n"


    const nameCell = newRow.insertCell();
    nameCell.innerHTML = filename


    const colorCell = newRow.insertCell();
    colorCell.innerHTML =
        `<label for="colorInput${id}" class="form-label"></label>` +
        `<input type="color" class="form-control form-control-color" id="colorInput${id}" value="#FFFFFF">`

    const imgCell = newRow.insertCell();
    imgCell.innerHTML =
        "<label class=\"svg-file-upload\" for=\"file-upload\">\n" +
        "     Img\n" +
        "</label>\n" +
        "<input accept=\".svg\" id=\"file-upload\" type=\"file\"/>"

    id++
}


const deleteItems = document.getElementById("deleteItems")
deleteItems.addEventListener("click", () => {
    const rowCount = tableObject.rows.length;
    for (let i = 1; i < rowCount; ++i) {
        const row = tableObject.rows[i];
        const chkbox = row.cells[0].getElementsByTagName('input')[0];
        const dataName = row.cells[1].innerHTML;
        if ('checkbox' === chkbox.type && true === chkbox.checked) {
            tableObject.deleteRow(i);
            const dataSources = viewer.dataSources;
            dataSources.getByName(dataName).forEach( (data) => {
                dataSources.remove(data, true);
            });
            i--;
            id--;
        }
    }
})
