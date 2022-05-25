import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';

import {DialogCtrl, MessageCtrl, UserCtrl, UploadFileCtrl} from "../controllers";
import {checkAuth, updateLastSeen} from "../middleware";
import {loginValidation, signupValidation} from "../utils/validations";

import multer from "./multer";


const createRoutes = (app: express.Express, io: any) => {

    const UserController = new UserCtrl(io);
    const DialogController = new DialogCtrl(io);
    const MessageController = new MessageCtrl(io);
    const UploadFileController = new UploadFileCtrl();

    app.use(cors({
        origin: '*',
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
        preflightContinue: true,
    }));
    app.use(bodyParser.json());
    // app.use((req, res, next) => {
    //     res.setHeader("Access-Control-Allow-Origin", "https://skymessenger.herokuapp.com");
    //     res.header(
    //         "Access-Control-Allow-Headers",
    //         "Origin, X-Requested-With, Content-Type, Accept"
    //     );
    //     next();
    // });
    app.use(checkAuth);
    app.use(updateLastSeen);


    app.get('/user/me', UserController.getMe);
    app.get('/user/verify', UserController.verify);
    app.post('/user/signup', cors(), signupValidation, UserController.create);
    app.post('/user/signin', cors(), loginValidation, UserController.login);
    app.get('/user/find', UserController.findUsers);
    app.get('/user/:id', UserController.show);
    app.delete('/user/:id', UserController.delete);

    app.get('/dialogs', DialogController.index);
    app.delete('/dialogs/:id', DialogController.delete);
    app.post('/dialogs', DialogController.create);

    app.get('/messages', MessageController.index);
    app.post('/messages', MessageController.create);
    app.delete('/messages', MessageController.delete);

    app.post("/files", multer.single("file"), UploadFileController.create);
    app.delete("/files", UploadFileController.delete);
}


export default createRoutes;
