import express from 'express';
// import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();
import './src/core/db';

import createRoutes from "./src/core/routes";
import createSocket from './src/core/socket';


const app = express();
const httpServer = createServer(app);
const io = createSocket(httpServer);

createRoutes(app, io);

httpServer.listen(process.env.PORT || 8080, function () {
    console.log(`Server: http://localhost:${process.env.PORT}`);
});
