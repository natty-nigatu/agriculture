const { v4: uuidv4 } = require("uuid");

function getProcess(executeQuery, processdata, callback) {
    let query =
        "SELECT process.*, user.name as ownername, user.TIN FROM process LEFT JOIN user ON process.user = user.id WHERE ";
    let params;
    if (processdata.user !== undefined) {
        query += "process.user = ?";
        params = processdata.user;
    } else if (processdata.id !== undefined) {
        query += "process.id = ?";
        params = processdata.id;
    } else if (processdata.bank !== undefined) {
        query += "process.bank = ?";
        params = [processdata.bank];

        if (processdata.step !== undefined) {
            query += " AND process.step = ?";
            params.push(processdata.step);
        }
    } else if (processdata.step !== undefined) {
        query += "process.step = ?";
        params = processdata.step;
    }

    query += " ORDER BY process.name";

    executeQuery(query, params, callback);
}

const addProcess = (connection, processdata, callback) => {
    const id = uuidv4();

    const query = "INSERT INTO process (id, user, name) VALUES (?, ?, ?)";
    const params = [id, processdata.user, processdata.name];

    connection.query(query, params, function (error, result) {
        error && console.log(error);
        callback({ id }, error);
    });
};

const deleteProcess = (executeQuery, processdata, callback) => {
    const query = "DELETE FROM process WHERE id = ?";
    const params = [processdata.id];

    executeQuery(query, params, callback);
};

function setProcess(executeQuery, processdata, callback) {
    let query = "UPDATE process SET ";
    let params = [];

    for (const property in processdata) {
        if (property === "id") continue;
        query += `${property} = ?, `;
        params.push(processdata[property]);
    }

    query = query.slice(0, -2) + " WHERE ID = ?";
    params.push(processdata.id);

    executeQuery(query, params, callback);
}

module.exports = { getProcess, addProcess, deleteProcess, setProcess };
