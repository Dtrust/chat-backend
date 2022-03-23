import express from 'express';
import { Server } from 'socket.io';

import {DialogController, MessageController, UserController} from "../controllers";


const createRoutes = (app: express.Express) => {
    app.get('/user/:id', UserController.show);
    app.get('/user/me', UserController.getMe);
    app.post('/user/signup', UserController.create);
    app.post('/user/signin', UserController.login);
    app.delete('/user/:id', UserController.delete);


    app.get('/dialogs/:id', DialogController.index);
    app.post('/dialogs/', DialogController.create);
    app.delete('/dialogs/:id', DialogController.delete);


    app.get('/messages', MessageController.index);
    app.post('/messages', MessageController.create);
    app.delete('/messages/:id', MessageController.delete);
}


export default createRoutes;
