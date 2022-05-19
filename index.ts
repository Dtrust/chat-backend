import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();
import './src/core/db';

import createRoutes from "./src/core/routes";
import createSocket from './src/core/socket';


const app = express();
const httpServer = createServer(app);
const io = createSocket(httpServer);
// const io = new Server(httpServer,  { cors: { origin: '*' } } );


createRoutes(app, io);

// app.use(bodyParser.urlencoded({extended: false}));

// const User = new UserController();
// const Dialog = new DialogController();
// const Messages = new MessageController();



// app.listen(process.env.PORT, () => {
//     console.log(`Server: http://localhost:${process.env.PORT}`)
// })


httpServer.listen(process.env.PORT, function () {
    console.log(`Server: http://localhost:${process.env.PORT}`);
});








// io.on('connection', (socket: Socket) => {
//     console.log('SOCKET CONNECTED!');
//
//     getApiAndEmit(socket);
//     socket.on('disconnect', () => {
//         console.log('Disconnected');
//     });
// });
//
// const getApiAndEmit = (socket: Socket) => {
//     const response = 'response you need';
//     socket.emit('FromAPI', response);
// };
//
// app.set('port', process.env.PORT );
//
// httpServer.listen(app.get('port'), () => {
//     console.log(`listening on *:${process.env.PORT}`);
// });
