import express from "express"
import {createServer} from "http"
import dotenv from "dotenv"
import "./core/db"
import  createRoutes from "./core/routes"



const app = express();
const http = createServer(app)
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    }
});
dotenv.config()


createRoutes(app, io)


io.on("connect", (socket: any) => {
    console.log("connect!")
    socket.emit("111", "123412414142qweq")

    socket.on("222", function (msg: any) {
        console.log("CLIENT SAY:" + msg)
    })
})

http.listen(process.env.PORT, function () {
    console.log(`Server: http://localhost:${process.env.PORT}`)
})