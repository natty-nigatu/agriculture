const db = require("../Database/index")

const getProcess= (req, res) => {
    db.getProcess(req.body, (result, error) => {
        if (error !== null) return res.sendStatus(400)

        res.json(result)
    })

}

const createProcess = (req, res) => {
    db.addProcess(req.body, (result, error) => {
        if (error !== null) return res.sendStatus(400)
        res.sendStatus(201)
        
    })
}

const updateProcess = (req, res) => {
    db.setProcess(req.body, (result, error) => {
        if(error !== null) return res.sendStatus(400)
        res.sendStatus(200)
    })
    
}

const deleteProcess = (req, res) => {
    db.deleteProcess({id: req.body.id}, (result, error) => {
        if(error !== null) return res.sendStatus(400)
        res.sendStatus(200)
    })
}

module.exports = {getProcess, createProcess, updateProcess, deleteProcess}