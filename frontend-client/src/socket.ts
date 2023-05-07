import { Server } from "socket.io"
import express from 'express'
import createServer from 'http'

export default (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    })

    // const app = express();
    // const httpServer = createServer(app);
    // const io = new Server(httpServer);

    return io;
}