let async = require('async')
let cheerio = require('cheerio')
let request = require('superagent')
let { URL } = require('url')
let util = require('../helper/util');
let xlsxHelper = require('../helper/xlsx')
let db = require('../helper/db');
const config = require('../config');
const { LOG } = require('../helper/log')

let getUrlPath = (url) => {
    let myURL = null;
    try {
        if (!url.startsWith('http')) {
            myURL = new URL(url, config.flipkart.siteUrl);
        } else {
            myURL = new URL(url);
        }
        return myURL.pathname;
    } catch (err) {
        return '';
    }
}

let flatCategoryArray = function (category) {
    var result = {
        items: [],
        title: category.title
    };
    var list = [];
    category.tabs.forEach(element => {
        element.columns.forEach(col => {
            list = list.concat(col);
        });
    });
    result.items = list.filter(item => {
        item.pathname = getUrlPath(item.url);
        return item.url && item.url.length > 1;
    }).sort((x, y) => {
        return x.pathname > y.pathname ? -1 : 1;
    })
    return result;
}

let getFirstEntryData = () => {
    let apiUrl = `${config.flipkart.siteUrl}/lc/getData?dataSourceId=websiteNavigationMenuDS_1.0`;
    return request.get(apiUrl)
        .type('json')
        .accept('json')
        .then(res => {
            let data = JSON.parse(res.text);
            return Promise.resolve(config.flipkart.categorys.reduce((r, key) => {
                r[key] = flatCategoryArray(data.navData[key]);
                return r;
            }, {}));
        }).catch(err => {
            return Promise.reject(err);
        });
}





exports.start = () => {
    getFirstEntryData().then(categorys => {
        console.log(categorys);
    })
        .catch(err => {
            LOG.error(err)
        })
}

