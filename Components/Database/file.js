const {v4: uuidv4} = require("uuid")

function getFile(executeQuery, filedata, callback) {
    const query = "SELECT * FROM file WHERE id = ? ";
    const params = filedata.id;

    executeQuery(query, params, callback);
}

const addFile = (connection, filedata, callback) => {
    var insertId = uuidv4();
    
    const query = "INSERT INTO file (id, name, user, bank) VALUES (?, ?, ?, ?)";
    const params = [insertId, filedata.name, filedata.user, filedata.bank];

    connection.query(query, params, function (error, result) {
        error && console.log(error);
        callback(insertId, error);
    });
};

const deleteFile = (executeQuery, filedata, callback) => {
    const query = "DELETE FROM file WHERE id = ?";
    const params = filedata.id
    executeQuery(query, params, callback);
};

module.exports = {getFile, addFile, deleteFile}