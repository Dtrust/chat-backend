import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import createRoutes from "./core/routes";

import './core/db'

import { updateLastSeen, checkAuth } from "./middleware";


const app = express();
const http = createServer(app);
const io = new Server(http);

dotenv.config();

createRoutes(app);

console.log(process.env.JWT_SECRET)

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(updateLastSeen);
app.use(checkAuth)

// const User = new UserController();
// const Dialog = new DialogController();
// const Messages = new MessageController();



// app.listen(process.env.PORT, () => {
//     console.log(`Server: http://localhost:${process.env.PORT}`)
// })

io.on('connection', (socket) => {
    console.log('SOCKET CONNECTED!');
});

http.listen(process.env.PORT, () => {
    console.log(`listening on *:${process.env.PORT}`);
});
