let async = require('async')
let cheerio = require('cheerio')
let request = require('superagent')
let _ = require('lodash')
const {
    flipkart: flipkartConfig
} = require('../config');
let {
    log: LOG,
    util,
    file: fileHelper,
    xlsx: xlsxHelper,
    db: dbHelper,
} = require('../helper');


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
        item.pathname = util.getUrlPathName(item.url, flipkartConfig.siteUrl);
        return item.url && item.url.length > 1;
    }).sort((x, y) => {
        return x.pathname > y.pathname ? -1 : 1;
    })
    return result;
}

let getFirstEntryData = () => {
    let apiUrl = `${flipkartConfig.siteUrl}/lc/getData?dataSourceId=websiteNavigationMenuDS_1.0`;
    return request.get(apiUrl)
        .type('json')
        .accept('json')
        .then(res => {
            let data = JSON.parse(res.text);
            return Promise.resolve(flipkartConfig.categorys.reduce((r, key) => {
                r[key] = flatCategoryArray(data.navData[key]);
                return r;
            }, {}));
        });
}

let getUniqSecondLink = (categorys) => {
    var allSecondList = [];
    for(let key in categorys){
        allSecondList = allSecondList.concat(categorys[key].items);
    }

    return _.uniqWith(allSecondList, (x, y)=>{
        return x.pathname == y.pathname;
    }).map(item=>item.pathname).sort();
}

exports.start = async () => {
    try {
        let categorys = await getFirstEntryData();
        let linkList = getUniqSecondLink(categorys)

        console.log(linkList);

    } catch (err) {
        console.log(err);
        LOG.error(err)
    }
}

