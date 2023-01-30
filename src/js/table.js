export function addRow(filename){
    $("#table").bootstrapTable('append', () => {
        return {
            name: filename,
        }
    })
}