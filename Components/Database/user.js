function getUser(executeQuery, userdata, callback) {
    let query = "SELECT * FROM user WHERE ";
    let params;
    if (userdata.id !== undefined) {
        query += "id = ?";
        params = userdata.id;
    } else if (userdata.username !== undefined) {
        query += "username = ?";
        params = userdata.username;
    }

    executeQuery(query, params, callback);
}

const addUser = (executeQuery, userdata, callback) => {
    const query = "INSERT INTO user (name, username, password) VALUES (?, ?, ?)";
    const params = [userdata.name, userdata.username, userdata.password];

    executeQuery(query, params, callback);
};

const deleteUser = (executeQuery, userdata, callback) => {
    let query = "DELETE FROM user WHERE ";
    let params;
    if (userdata.id !== undefined) {
        query += "id = ?";
        params = userdata.id;
    } else if (userdata.username !== undefined) {
        query += "username = ?";
        params = userdata.username;
    }

    executeQuery(query, params, callback);
};

function getAllUsers(executeQuery, callback) {
    const query = "SELECT * FROM user ";
    executeQuery(query, null, callback);
}

function setUser(executeQuery, userdata, callback) {
    let query = "UPDATE user SET ";
    let params = [];

    for (const property in userdata) {
        if (property === "id") continue;
        query += `${property} = ?, `;
        params.push(userdata[property]);
    }

    query = query.slice(0, -2) + " WHERE ID = ?";
    params.push(userdata.id);

    executeQuery(query, params, callback);
}

module.exports = { getUser, addUser, getAllUsers, setUser, deleteUser };
