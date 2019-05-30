let fs = require('fs')
let path = require('path')
let xlxs = require('xlsx');


function mkdirSync(dir) {
    if (fs.existsSync(dir)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dir))) {
            fs.mkdirSync(dir)
            return true;
        }
    }
}


function mkdir(dir, callback) {
    fs.exists(dir, function (exists) {
        if (exists) {
            callback();
        } else {
            mkdir(path.dirname(dir), function () {
                fs.mkdir(dir);
            })
        }
    })
}

function appendFile() {
    let args = Array.from(arguments)
    let dir = path.dirname(args[0]);
    mkdir(dir, () => {
        fs.appendFile(...args)
    });
}

function appendFileSync() {
    let args = Array.from(arguments)
    let dir = path.dirname(args[0]);
    if (mkdirSync(dir)) {
        fs.appendFileSync(...args)
    }
}


function writeFile(){
    let args = Array.from(arguments)
    let dir = path.dirname(args[0]);
    mkdir(dir, ()=>{
        fs.writeFile(...args)
    })
}

function writeFileSync(){
    let args = Array.from(arguments)
    let dir = path.dirname(args[0]);
    if (mkdirSync(dir)) {
        fs.writeFileSync(...args)
    }
}

module.exports = {
    mkdir,
    mkdirSync,
    writeFile,
    writeFileSync,
    appendFileSync,
    appendFile
}



