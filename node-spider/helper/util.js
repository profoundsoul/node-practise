let { URL } = require('url')
let _ = require('lodash')


exports.getUrlPathName = (url, host) => {
    let myURL = null;
    try {
        if (!url.startsWith('http') && host) {
            myURL = new URL(url, host);
        } else {
            myURL = new URL(url);
        }
        return myURL.pathname;
    } catch (err) {
        return '';
    }
}




