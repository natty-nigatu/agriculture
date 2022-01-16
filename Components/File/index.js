const res = require("express/lib/response");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const db = require("../Database/index");
const { getIdName, rootDir, fileExists } = require("./rename");

const addFile = (file, user, bank, callback) => {
    const name = getIdName(file.name);
    file.mv(rootDir + name, (error) => {
        error && console.log(error);
    });

    db.addFile({ name, user, bank }, (insertId) => {
        callback(insertId);
    });
};

const deleteFile = (fileid, callback) => {
    getFile(fileid, (file) => {
        if(file.length == 0) return callback(404)
        db.deleteFile(file[0], (result) => {
            console.log("out")
            if (fileExists(file[0].name)) {
                console.log("in")
                fs.unlinkSync(rootDir + file[0].name);
            }
            callback(result)
        });
    });
};

const getFile = (fileid, callback) => {
    db.getFile({ id: fileid }, (result) => {
        callback(result);
    });
};

module.exports = { addFile, deleteFile, getFile };
