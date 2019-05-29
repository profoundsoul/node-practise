let async = require('async')
let cheerio = require('cheerio')
let request = require('superagent')

let util = require('../helper/util');
let xlsxHelper = require('../helper/xlsx')
let db = require('../helper/db');
const config = require('../config');
const {LOG} = require('../helper/log')



let getFirstEntryData = ()=>{
    let apiUrl = `${config.flipkart.siteUrl}/lc/getData?dataSourceId=websiteNavigationMenuDS_1.0`;
    request.get(apiUrl).then(res=>{

        LOG.info(res)
    }).catch(err=>{
        LOG.info(err)
    });
}


exports.start = ()=>{
    getFirstEntryData();
}

