const {v4: uuidv4} = require("uuid")

function getProcess(executeQuery, processdata, callback) {
    let query = "SELECT * FROM process WHERE ";
    let params;
    if (processdata.user !== undefined) {
        query += "user = ?";
        params = processdata.user;
    } else if (processdata.id !== undefined) {
        query += "id = ?";
        params = processdata.id;
    } else if (processdata.bank !== undefined) {
        query += "bank = ?";
        params = [processdata.bank];

        if (processdata.step !== undefined) {
            query += " AND step = ?";
            params.push(processdata.step);
        }
    } else if (processdata.step !== undefined) {
        query += "step = ?";
        params = processdata.step;
    }

    executeQuery(query, params, callback);
}

const addProcess = (executeQuery, processdata, callback) => {
    const query = "INSERT INTO process (id, user) VALUES (?, ?)";
    const params = [uuidv4(), processdata.user];

    executeQuery(query, params, callback);
};

const deleteProcess = (executeQuery, processdata, callback) => {
    const query = "DELETE FROM process WHERE id = ?";
    const params = processdata.id;

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
