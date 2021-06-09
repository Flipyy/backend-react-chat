import mongoose from "mongoose"
import express from "express"
import bodyParser from "body-parser";
import dotenv from "dotenv"

import {UserController, DialogController, MessageController} from "./controllers";

import {checkAuth, updateLastSeen} from "./middleware";

const app = express();
dotenv.config()

const User = new UserController()
const Dialog = new DialogController()
const Messages = new MessageController()

app.use(bodyParser.json())
app.use(updateLastSeen)


mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});


app.get("/user/:id", User.show)
app.delete("/user/:id", User.delete)
app.post("/user/registration", User.create)
app.post("/user/login", User.login)

app.get("/dialogs", Dialog.index)
app.delete("/dialogs/:id", Dialog.delete)
app.post("/dialogs", Dialog.create)

app.get("/messages", Messages.index)
app.post("/messages", Messages.create)
app.delete("/messages/:id", Messages.delete)

app.listen(process.env.PORT, function () {
    console.log(`Server: http://localhost:${process.env.PORT}`)
})