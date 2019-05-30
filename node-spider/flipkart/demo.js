let async = require('async')
let cheerio = require('cheerio')
let request = require('superagent')

let fileHelper = require('../helper/file');
let xlsxHelper = require('../helper/xlsx')
let db = require('../helper/db');


let siteUrl = 'https://www.flipkart.com';
const HTML_DIR = 'output/html';
request.get(siteUrl).then(res => {
    fileHelper.appendFileSync(`${HTML_DIR}/flipkart.html`, res.text);
    var ws_data = [
        ["S", "h", "e", "e", "t", "J", "S"],
        [1, 2, 3, 4, 5]
    ];
    xlsxHelper.writeAoaToExcel({
        fileName: 'aaaa.xlsx',
        doubleList: ws_data
    });

    var list = [
        { S: 1, h: 2, e: 3, e_1: 4, t: 5, J: 6, S_1: 7 },
        { S: 2, h: 3, e: 4, e_1: 5, t: 6, J: 7, S_1: 8 }
    ];
    xlsxHelper.writeJsonToExcel({
        fileName: 'jsonExcel.xlsx',
        list: list
    })
    // fs.appendFileSync(`${HTML_DIR}/flipkart.html`, res.text);
})


db.connectFlipkartCollection('goods').then(({collection, client, db})=>{
    collection.find().toArray((err, d)=>{
        console.log(d, db, client);
        client.close();
    })
})


