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
    // .sort((x, y) => {
    //     return x.pathname > y.pathname ? -1 : 1;
    // })
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

let getSecondEntryData = async ({ url }) => {
    url = `${flipkartConfig.siteUrl}/${url}`;
    return await request.get(url).then(res => {
        fileHelper.writeFileSync(`${flipkartConfig.output}/second_flipkart.html`, res.text)
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
        async.eachOfSeries(categorys,async (item, key)=>{
             await async.eachLimit(item.items, 2,async (cate, ck, cb)=>{
                let r = await getSecondEntryData(cate.url);
                return cb(r);
            }, error=>{
                console.log(error);
                LOG.log(error);
            })
        }, err=>{
            console.log(err);
            LOG.log(err);
        })
    } catch (err) {
        console.log(err);
        LOG.error(err)
    }
}

