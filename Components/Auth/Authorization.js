require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
};

const authorizeToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
};

const authorizeGetToken = (req, res, next) => {
    const token = req.query.token;
    const id = req.query.id;
    const name = req.query.name;

    if (
        token === undefined ||
        token === null ||
        id === undefined ||
        id === null
    )
        return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.body.id = id;
        req.user = user;
        req.name = name;
        next();
    });
};

module.exports = { createToken, authorizeToken, authorizeGetToken };
