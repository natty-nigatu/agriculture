const fileComp = require("../File/index");
const path = require("path");

const rootDir = path.join(__dirname + "../../../Files/");

const getFile = (req, res) => {
    fileComp.getFile(req.body.id, (file) => {
        if (file.length == 0) return res.sendStatus(404);

        if (req.user.id !== "1" && req.user.id !== "2" && file[0].user !== req.user.id) return res.sendStatus(403);

        res.sendFile(rootDir + file[0].name);
    });
};

const getDownloadFile = (req, res) => {
    fileComp.getFile(req.body.id, (file) => {
        if (file.length == 0) return res.sendStatus(404);

        if (req.user.id !== "1" && req.user.id !== "2" && file[0].user !== req.user.id) return res.sendStatus(403);

        const name = req.name + "." + file[0].name.split(".").at(-1);

        res.download(rootDir + file[0].name, name);
    });
};

const createFile = (req, res) => {
    let file = req.files.file;
    const user = req.body.user;
    const bank = req.body.bank;

    fileComp.addFile(file, user, bank, (fileid, error) => {
        if (error !== null) return res.sendStatus(400);
        res.status(201).json({ id: fileid });
    });
};

const deleteFile = (req, res) => {
    fileComp.getFile(req.body.id, (file) => {
        if (file.length == 0) return res.sendStatus(404);

        if (file[0].user !== req.user.id) return res.sendStatus(403);

        fileComp.deleteFile(req.body.id, (result, error) => {
            if (error !== null) return res.sendStatus(400);
            if (result === 401) return res.sendStatus(401);
            res.sendStatus(200);
        });
    });
};

module.exports = { getFile, createFile, deleteFile, getDownloadFile };
