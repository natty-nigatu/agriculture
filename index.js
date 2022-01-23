const express = require("express");
const upload = require("express-fileupload");
const cors = require('cors');
const app = express();
const authentication = require("./Components/API/authentication");
const authorization = require("./Components/Auth/authorization");
const processp = require("./Components/API/process")
const user = require("./Components/API/user")
const file = require("./Components/API/file")

app.use(upload());
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.put("/process", authorization.authorizeToken, processp.createProcess)//Include user, name
app.post("/process", authorization.authorizeToken, processp.getProcess) //use user, id, bank, step
app.patch("/process", authorization.authorizeToken, processp.updateProcess)
app.delete("/process", authorization.authorizeToken, processp.deleteProcess)

app.post("/user", authorization.authorizeToken, user.getUser) //use id, username
app.patch("/user", authorization.authorizeToken, user.updateUser)
app.delete("/user", authorization.authorizeToken, user.deleteUser)

//username, password, newPassword, type
app.post("/changepassword", authorization.authorizeToken, authentication.changePassword);
app.post("/signup", authentication.signUp);//username, password, type, name
app.post("/login", authentication.logIn);//username, password, type

app.get("/download", authorization.authorizeGetToken, file.getDownloadFile)//id, token
app.get("/file/:dummy", authorization.authorizeGetToken, file.getFile)//id, token
app.post("/file", authorization.authorizeToken, file.getFile);//id
app.put("/file",authorization.authorizeToken, file.createFile);//file, user, bank
app.delete("/file", authorization.authorizeToken, file.deleteFile);



app.listen(5000, () => console.log("Server is Listening"));
