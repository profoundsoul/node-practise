const MongoClient = require('mongodb').MongoClient;
let config = require('../config');


let connect = (dbName) => {
    return MongoClient.connect(config.db.getConnectUrl(dbName), {
        useNewUrlParser: true,
    }).then(client => {
        return Promise.resolve({
            db: client.db(dbName),
            client
        })
    })
}

let connectCollection = (dbName, collectionName) => {
    return connect(dbName).catch(client => {
        console.log('db connetion failed');
        client.close();
    }).then(({ client, db }) => {
        return Promise.resolve({
            collection: db.collection(collectionName),
            db,
            client
        });
    });
}

let firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')

let generateDatabaseConnect = (dbName) => {
    return function () {
        let args = Array.from(arguments);
        return connect(dbName, ...args)
    }
}

let generateDatabaseConnectCollection = (dbName) => {
    return function () {
        let args = Array.from(arguments);
        return connectCollection(dbName, ...args);
    }
}

let dynamicConnect = {};
for (let key in config.db) {
    if(typeof config.db[key] !== 'function'){
        let keyName = firstUpperCase(key);
        dynamicConnect[`connect${keyName}Collection`] = generateDatabaseConnectCollection(key);
        dynamicConnect[`connect${keyName}`] = generateDatabaseConnect(key);
    }
}

// let connectTestCollection = (collectionName) => {
//     return connectCollection('test', collectionName);
// }

module.exports = {
    connect,
    connectCollection,
    ...dynamicConnect
}

