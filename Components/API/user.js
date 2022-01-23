const db = require("../Database/index");

const getUser = (req, res) => {
    const type = req.body.type;
    delete req.body.type;

    if (type === "org")
        db.getOrg(req.body, (result, error) => {
            if (error !== null) return res.sendStatus(400);
            for (const one of result) delete one.password;
            res.json(result);
        });
    else
        db.getUser(req.body, (result, error) => {
            if (error !== null) return res.sendStatus(400);
            for (const one of result) delete one.password;
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
    const type = req.body.type;
    delete req.body.type;

    if (type === "org")
        db.setOrg(req.body, (result, error) => {
            if (error !== null) return res.sendStatus(400);
            res.sendStatus(200);
        });
    else
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
