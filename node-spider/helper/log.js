let log4js = require('log4js');
let config = require('../config');

// log4js.configure({
//     appenders: [
// 		{ type: 'file', filename: `${config.log.logPath}/out.log`, category: 'log4jslog' }
//     ],
// });


log4js.configure({
    level: 'debug',
    appenders: {
        out: {
            type: 'stdout'
        },
        spider: {
            type: 'file',
            filename: `${config.log.logPath}/out.log`
        }
    },
    categories: {
        default: {
            appenders: ['spider', 'out'],
            level: 'debug'
        }
    }
});


module.exports = log4js.getLogger();

