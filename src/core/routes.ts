import bodyParser from "body-parser";
import express from "express"
import socket from "socket.io"
import {checkAuth, updateLastSeen} from "../middleware";
import {loginValidation} from "../utils/validations";
import {UserCtrl, DialogCtrl, MessageCtrl} from "../controllers"

const createRoutes = (app: express.Express, io: socket.Server) => {
    const UserController = new UserCtrl();
    const DialogController = new DialogCtrl();
    const MessageController = new MessageCtrl();

    app.use(bodyParser.json())
    app.use(updateLastSeen)
    app.use(checkAuth)

    app.get("/user/me", UserController.getMe)
    app.get("/user/:id", UserController.show)
    app.delete("/user/:id", UserController.delete)
    app.post("/user/registration", UserController.create)
    app.post("/user/login", loginValidation, UserController.login)

    app.get("/dialogs", DialogController.index)
    app.delete("/dialogs/:id", DialogController.delete)
    app.post("/dialogs", DialogController.create)

    app.get("/messages", MessageController.index)
    app.post("/messages", MessageController.create)
    app.delete("/messages/:id", MessageController.delete)

}

export default createRoutes