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
    })
    return result;
}

let getFirstEntryData = () => {
    let url = `${flipkartConfig.siteUrl}/lc/getData?dataSourceId=websiteNavigationMenuDS_1.0`;
    var t = new util.TimeRecord();
    console.log('Catch First Entry Start：', url);
    return request.get(url)
        .type('json')
        .accept('json')
        .then(res => {
            let data = JSON.parse(res.text);
            console.log(`Catch First Entry End，${t.end()}ms：${url}`);
            return Promise.resolve(flipkartConfig.categorys.reduce((r, key) => {
                r[key] = flatCategoryArray(data.navData[key]);
                return r;
            }, {}));
        });
}

let getSecondEntryData = async ({ url, pathname }) => {
    url = `${flipkartConfig.siteUrl}${url}`;
    var t = new util.TimeRecord();
    console.log(`Catch Second Entry Start：${url}`);
    return await request.get(url).then(res => {
        console.log(`Catch Second Entry End，${t.end()}ms：${url}`);
        fileHelper.writeFileSync(`${flipkartConfig.output}/${pathname}.html`, res.text)
        return Promise.resolve(res)
    })
}

let getUniqSecondLink = (categorys) => {
    var allSecondList = [];
    for (let key in categorys) {
        allSecondList = allSecondList.concat(categorys[key].items);
    }

    return _.uniqWith(allSecondList, (x, y) => {
        return x.pathname == y.pathname;
    }).map(item => item.pathname).sort();
}

exports.start = async () => {
    try {
        let categorys = await getFirstEntryData();
        let linkList = getUniqSecondLink(categorys)
        // let res = await getSecondEntryData(categorys.electronics.items[1]);
        await async.eachOfSeries(categorys, async (item, key) => {
            try {
                await async.eachOfLimit(item.items, 2, async (cate, index, callback) => {
                    try {
                        await getSecondEntryData(cate);
                    } catch (err) {
                        console.log(err, cate.url);
                    }
                })
            } catch (err) {
                console.log(err);
            }
        })
    } catch (err) {
        console.log(err);
    }
}

