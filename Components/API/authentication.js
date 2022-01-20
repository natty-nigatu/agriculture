const authentication = require("../Auth/authentication");
const authorization = require("../Auth/authorization");

const changePassword = (req, res) => {
    const { username, password, newPassword, type } = req.body;
    const userdata = { username, password };

    authentication.changePassword(
        type,
        userdata,
        newPassword,
        (result, error) => {
            if (error !== null) return res.sendStatus(400);
            res.sendStatus(200);
        }
    );
};

const signUp = (req, res) => {
    const { username, password, type, name } = req.body;
    const userdata = { username, password, name };
    authentication.signUp(type, userdata, (result) => {
        if (result === "taken") return res.status(400).send("taken");
        else return res.status(200).send("Account Created Successfully");
    });
};

const logIn = (req, res) => {
    const { username, password, type } = req.body;
    const userdata = { username, password };
    authentication.logIn(type, userdata, (userId) => {
        if (userId === "error") return res.send(userId);

        const tokenPayload = { id: userId, username, type };
        const token = authorization.createToken(tokenPayload);
        res.status(200).json({ token, id:userId });
    });
};

module.exports = { changePassword, signUp, logIn };
