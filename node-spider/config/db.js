
let getConnectUrl = (dbName) => {
    var db = config[dbName];
    if (db.user && db.pwd) {
        return `mongodb://${db.user}:${db.pwd}@${db.host}:${db.port}/${dbName}?retryWrites=true`
    }
    return `mongodb://${db.host}:${db.port}/${dbName}?retryWrites=true`
}

const config = {
    test: {
        host: '10.250.160.92',
        port: '27017',
        user: 'test',
        pwd: '123456',
    },
    flipkart: {
        host: '10.250.160.92',
        port: '27017',
        user: 'owner',
        pwd: '123456',
    },
};

module.exports = {
    ...config,
    getConnectUrl
}