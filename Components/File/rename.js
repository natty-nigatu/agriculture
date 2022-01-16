var fs = require("fs");
var { v4: uuidv4 } = require("uuid");

const rootDir = "./Files/";

const getIdName = (oldName) => {
    var ext = oldName.split(".").at(-1);
    var name = uuidv4() + "." + ext;

    if (fileExists(name)) return getIdName(name);

    return name;
};

const fileExists = (name) => {
    return fs.existsSync(rootDir + name)
}

module.exports = { getIdName, rootDir, fileExists };
