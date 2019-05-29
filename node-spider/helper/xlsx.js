let XLSX = require('xlsx');
let fileUtil = require('./util')
let path = require('path')

// function writeAoaToExcel(fileName, doubleArr) {
function writeAoaToExcel({
    doubleList,
    fileName = 'aoa.xlsx',
    sheetName = '',
    sheetOpts = {},
    writeOpts = {}
}) {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(doubleList, sheetOpts);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    let dir = path.dirname(fileName);
    try {
        fileUtil.mkdirSync(dir)
        XLSX.writeFile(wb, fileName, writeOpts);
    } catch (err) {
        console.log(err);
        return null;
    }
    return wb;
}


function writeJsonToExcel({
    list,
    fileName = 'json.xlsx',
    sheetName = '',
    sheetOpts = {},
    writeOpts = {}
}) {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(list, sheetOpts);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    let dir = path.dirname(fileName);
    try {
        fileUtil.mkdirSync(dir)
        XLSX.writeFile(wb, fileName, writeOpts);
    } catch (err) {
        console.log(err);
        return null;
    }
    return wb;
}


module.exports = {
    writeAoaToExcel,
    writeJsonToExcel,
}




