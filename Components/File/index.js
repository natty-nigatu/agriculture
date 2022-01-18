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

    db.addFile({ name, user, bank }, (insertId, error) => {
        callback(insertId, error);
    });
};

const deleteFile = (fileid, callback) => {
    getFile(fileid, (file) => {
        if(file.length == 0) return callback(401)
        db.deleteFile(file[0], (result, error) => {
            if (fileExists(file[0].name)) {
                fs.unlinkSync(rootDir + file[0].name);
            }
            callback(result, error)
        });
    });
};

const getFile = (fileid, callback) => {
    db.getFile({ id: fileid }, (result) => {
        callback(result);
    });
};

module.exports = { addFile, deleteFile, getFile };
