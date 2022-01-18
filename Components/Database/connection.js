var mysql = require("mysql");

const connect = () => {
    let connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "MySQL",
        database: "intertrade",
    });

    connection.connect(function (err) {
        if (err) {
            console.log(err)
            //console.error("error connecting: " + err.stack);
            return;
        }

        console.log("connected as id " + connection.threadId);
    });
    return connection;
};

module.exports = connect;
