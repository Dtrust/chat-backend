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
    app.use(updateLastSeen);
    app.use(checkAuth);

    app.get('/user/:id', UserController.show);
    app.get('/user/me', UserController.getMe);
    app.post('/user/signup', signupValidation, UserController.create);
    app.post('/user/signin', loginValidation, UserController.login);
    app.delete('/user/:id', UserController.delete);


    app.get('/dialogs/:id', DialogController.index);
    app.post('/dialogs/', DialogController.create);
    app.delete('/dialogs/:id', DialogController.delete);


    app.get('/messages', MessageController.index);
    app.post('/messages', MessageController.create);
    app.delete('/messages/:id', MessageController.delete);
}


export default createRoutes;
