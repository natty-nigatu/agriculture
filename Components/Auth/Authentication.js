const db = require("../Database/index");
const bcrypt = require("bcrypt");

const signUp = (type, userdata, callback) => {
    bcrypt.hash(userdata.password, 10).then((password) => {
        if (type === "user") {
            db.getUser({ username: userdata.username }, (res) => {
                if (res.length !== 0) return callback("taken");

                db.addUser({ ...userdata, password }, callback);
            });
        } else {
            db.getBank({ username: userdata.username }, (res) => {
                if (res.length !== 0) return callback("taken");

                db.addBank({ ...userdata, password }, callback);
            });
        }
    });
};

const logIn = (type, userdata, callback) => {
    if (type === "user") {
        db.getUser({ username: userdata.username }, (res) => {
            if (res.length === 0) return callback("error");

            const user = res[0];
            bcrypt.compare(userdata.password, user.password).then((result) => {
                if (result) return callback(user.id);
                return callback("error");
            });
        });
    } else if (type === "bank") {
        db.getBank({ username: userdata.username }, (res) => {
            if (res.length === 0) return callback("error");

            const user = res[0];
            bcrypt.compare(userdata.password, user.password).then((result) => {
                if (result) return callback(user.id);
                return callback("error");
            });
        });
    } else {
        db.getOrg({ username: userdata.username }, (res) => {
            if (res.length === 0) return callback("error");

            const user = res[0];
            bcrypt.compare(userdata.password, user.password).then((result) => {
                if (result) return callback(user.id);
                return callback("error");
            });
        });
    }
};

const changePassword = (type, userdata, newPassword, callback) => {
    if (type === "user") {
        db.getUser({ username: userdata.username }, (res) => {
            if (res.length === 0) return callback("error");

            const user = res[0];
            bcrypt.compare(userdata.password, user.password).then((result) => {
                if (!result) return callback("error");
                bcrypt.hash(newPassword, 10).then((password) => {
                    db.setUser({ id: user.id, password }, (result, error) => {
                        callback(result, error);
                    });
                });
            });
        });
    } else if (type === "bank") {
        db.getBank({ username: userdata.username }, (res) => {
            if (res.length === 0) return callback("error");

            const user = res[0];
            bcrypt.compare(userdata.password, user.password).then((result) => {
                if (!result) return callback("error");
                bcrypt.hash(newPassword, 10).then((password) => {
                    db.setBank({ id: user.id, password }, (result, error) => {
                        callback(result, error);
                    });
                });
            });
        });
    } else {
        db.getOrg({ username: userdata.username }, (res) => {
            if (res.length === 0) return callback("error");

            const user = res[0];
            bcrypt.compare(userdata.password, user.password).then((result) => {
                if (!result) return callback("error");
                bcrypt.hash(newPassword, 10).then((password) => {
                    db.setOrg({ id: user.id, password }, (result, error) => {
                        callback(result, error);
                    });
                });
            });
        });
    }
};

module.exports = { signUp, logIn, changePassword };
