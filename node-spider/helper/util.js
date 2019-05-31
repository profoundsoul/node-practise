let { URL } = require('url')
let _ = require('lodash')


let getURL = (url, host) => {
    let myURL = null;
    try {
        return (!url.startsWith('http') && host) ? new URL(url, host) : new URL(url);
    } catch (err) {
        return null;
    }
}

let getHref = (url, host) => {
    let myURL = getURL(url, host);
    return myURL ? myURL.href : url;
}

let getUrlPathName = (url, host) => {
    let myURL = getURL(url, host);
    return myURL ? myURL.pathname : '';
}

/**
 * 时间记录器
 */
class TimeRecord {
    constructor() {
        this.reset();
    }
    now() {
        return new Date();
    }
    reset() {
        this.time = this.now().getTime();
    }
    log() {
        var end = this.now().getTime();
        return end - this.time;
    }
    end() {
        let interval = this.log();
        this.reset();
        return interval;
    }
}

module.exports = {
    getURL,
    getHref,
    getUrlPathName,
    TimeRecord
}




