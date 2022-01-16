const {v4: uuidv4} = require("uuid")

function getBank(executeQuery, bankdata, callback) {
    let query = "SELECT * FROM bank WHERE ";
    let params;
    if (bankdata.id !== undefined) {
        query += "id = ?";
        params = bankdata.id;
    } else if (bankdata.username !== undefined) {
        query += "username = ?";
        params = bankdata.username;
    }

    executeQuery(query, params, callback);
}

const addBank = (executeQuery, bankdata, callback) => {
    const query = "INSERT INTO bank (id, username, password) VALUES (?, ?, ?)";
    const params = [uuidv4(), bankdata.username, bankdata.password];

    executeQuery(query, params, callback);
};

const deleteBank = (executeQuery, bankdata, callback) => {
    let query = "DELETE FROM bank WHERE ";
    let params;
    if (bankdata.id !== undefined) {
        query += "id = ?";
        params = bankdata.id;
    } else if (bankdata.username !== undefined) {
        query += "username = ?";
        params = bankdata.username;
    }

    executeQuery(query, params, callback);
};

function getAllBanks(executeQuery, callback) {
    const query = "SELECT * FROM bank ";
    executeQuery(query, null, callback);
}

function setBank(executeQuery, bankdata, callback) {
    let query = "UPDATE bank SET ";
    let params = [];

    for (const property in bankdata) {
        if (property === "id") continue;
        query += `${property} = ?, `;
        params.push(bankdata[property]);
    }

    query = query.slice(0, -2) + " WHERE ID = ?";
    params.push(bankdata.id);

    executeQuery(query, params, callback);
}

function getOrg(executeQuery, orgdata, callback) {
    let query = "SELECT * FROM govorg WHERE ";
    let params;
    if (orgdata.id !== undefined) {
        query += "id = ?";
        params = orgdata.id;
    } else if (orgdata.username !== undefined) {
        query += "username = ?";
        params = orgdata.username;
    }

    executeQuery(query, params, callback);
}

function setOrg(executeQuery, orgdata, callback) {
    let query = "UPDATE govorg SET ";
    let params = [];

    for (const property in orgdata) {
        if (property === "id") continue;
        query += `${property} = ?, `;
        params.push(orgdata[property]);
    }

    query = query.slice(0, -2) + " WHERE ID = ?";
    params.push(orgdata.id);

    executeQuery(query, params, callback);
}

module.exports = { getBank, addBank, deleteBank, getAllBanks, setBank, getOrg, setOrg };
