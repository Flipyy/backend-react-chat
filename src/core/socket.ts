import socket from "socket.io"
import http from "http"

export default (http: http.Server) => {
    const io = require("socket.io")(http, {
        cors: {
            origin: "*",
        }
    });

    io.on("connect", (socket: socket.Socket) => {

    })

    return io
}