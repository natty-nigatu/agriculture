const db = require("../Database/index");

const getUser = (req, res) => {
    db.getUser(req.body, (result, error) => {
        if (error !== null) return res.sendStatus(400);

        res.json(result);
    });
};

const createUser = (req, res) => {
    db.addUser({ user: req.body.user }, (result, error) => {
        if (error !== null) return res.sendStatus(400);
        res.sendStatus(201);
    });
};

const updateUser = (req, res) => {
    db.setUser(req.body, (result, error) => {
        if (error !== null) return res.sendStatus(400);
        res.sendStatus(200);
    });
};

const deleteUser = (req, res) => {
    db.deleteUser({ id: req.body.id }, (result, error) => {
        if (error !== null) return res.sendStatus(400);
        res.sendStatus(200);
    });
};

module.exports = { getUser, createUser, updateUser, deleteUser };
