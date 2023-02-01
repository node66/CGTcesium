const tableObject = document.getElementById("table")

export function addRow(filename) {
    const newRow = tableObject.insertRow();
    const checkboxCell = newRow.insertCell();
    checkboxCell.innerHTML =
        "<div class=\"form-check\">\n" +
        "    <label>\n" +
        "        <input class=\"form-check-input\" type=\"checkbox\" value=\"\">\n" +
        "    </label>\n" +
        "</div>"

    const nameCell = newRow.insertCell();
    nameCell.innerHTML = filename

    const colorCell = newRow.insertCell();
    colorCell.innerHTML =
        "<label for=\"сolorInput\" class=\"form-label\"></label>" +
        "<input type=\"color\" class=\"form-control form-control-color\" id=\"сolorInput\" value=\"#FFFFFF\" title=\"Choose your color\" autocompleted=\"\">"


    const imgCell = newRow.insertCell();
    imgCell.innerHTML =
        "<label class=\"svg-file-upload\" for=\"file-upload\">\n" +
        "     Img\n" +
        "</label>\n" +
        "<input accept=\".svg\" id=\"file-upload\" type=\"file\"/>"
}