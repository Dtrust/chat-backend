import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';

import {DialogCtrl, MessageCtrl, UserCtrl} from "../controllers";
import {checkAuth, updateLastSeen} from "../middleware";
import {loginValidation, signupValidation} from "../utils/validations";


const createRoutes = (app: express.Express, io: any) => {

    const UserController = new UserCtrl(io);
    const DialogController = new DialogCtrl(io);
    const MessageController = new MessageCtrl(io);

    app.use(bodyParser.json());
    app.use(cors());
    app.use(checkAuth);
    app.use(updateLastSeen);

    app.get('/user/me', UserController.getMe);
    app.get('/user/verify', UserController.verify);
    app.post('/user/signup', signupValidation, UserController.create);
    app.post('/user/signin', loginValidation, UserController.login);
    app.get('/user/:id', UserController.show);
    app.delete('/user/:id', UserController.delete);


    app.get('/dialogs', DialogController.index);
    app.delete('/dialogs/:id', DialogController.delete);
    app.post('/dialogs', DialogController.create);


    app.get('/messages', MessageController.index);
    app.post('/messages', MessageController.create);
    app.delete('/messages/:id', MessageController.delete);
}


export default createRoutes;
