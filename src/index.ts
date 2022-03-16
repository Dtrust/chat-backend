import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { UserController, DialogController } from './controllers'


const app = express()
const port = 3000

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const User = new UserController();
const Dialog = new DialogController();

mongoose.connect('mongodb+srv://admin_chat:PcC03bt4EMPOmQeX@cluster0.dfivd.mongodb.net/chat');

app.get('/user/:id', User.show);

app.post('/user/signup', User.create);

app.delete('/user/:id', User.delete);


app.get('/dialogs/:id', Dialog.index);
app.post('/dialogs/', Dialog.create);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
