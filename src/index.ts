import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { UserController, DialogController, MessageController } from './controllers';

import { updateLastSeen } from "./middleware";


const app = express()
const port = 3000

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(updateLastSeen);

const User = new UserController();
const Dialog = new DialogController();
const Messages = new MessageController();

mongoose.connect('mongodb+srv://admin_chat:PcC03bt4EMPOmQeX@cluster0.dfivd.mongodb.net/chat');

app.get('/user/:id', User.show);
app.post('/user/signup', User.create);
app.delete('/user/:id', User.delete);


app.get('/dialogs/:id', Dialog.index);
app.post('/dialogs/', Dialog.create);
app.delete('/dialogs/:id', Dialog.delete);


app.get('/messages', Messages.index);
app.post('/messages', Messages.create);
app.delete('/messages/:id', Messages.delete);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
