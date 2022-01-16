const connect = require("./connection");
const user = require("./user");
const process = require("./process")
const org = require("./org");
let connection = connect();

function executeQuery(query, params, callback) {
    connection.query(query, params, function (error, result) {
        error && console.log(error);
        callback(result, error);
    });
}

const getUser = (userdata, callback) => user.getUser(executeQuery, userdata, callback);
const addUser = (userdata, callback) => user.addUser(executeQuery, userdata, callback);
const getAllUsers = (callback) => user.getAllUsers(executeQuery, callback);
const setUser = (userdata, callback) => user.setUser(executeQuery, userdata, callback);
const deleteUser = (userdata, callback) => user.deleteUser(executeQuery, userdata, callback);

const getBank = (bankdata, callback) => org.getBank(executeQuery, bankdata, callback);
const addBank = (bankdata, callback) => org.addBank(executeQuery, bankdata, callback);
const getAllBanks = (callback) => org.getAllBanks(executeQuery, callback);
const setBank = (bankdata, callback) => org.setBank(executeQuery, bankdata, callback);
const deleteBank = (bankdata, callback) => org.deleteBank(executeQuery, bankdata, callback);

const getOrg = (orgdata, callback) => org.getOrg(executeQuery, orgdata, callback);
const setOrg = (orgdata, callback) => org.setOrg(executeQuery, orgdata, callback);

const getProcess = (processdata, callback) => process.getProcess(executeQuery, processdata, callback);
const addProcess = (processdata, callback) => process.addProcess(executeQuery, processdata, callback);
const setProcess = (processdata, callback) => process.setProcess(executeQuery, processdata, callback);
const deleteProcess = (processdata, callback) => process.deleteProcess(executeQuery, processdata, callback);
