import express from 'express'

import { MessageModel, DialogModel } from '../models';


class MessageController {

    io: any;

    constructor(io: any) {
        this.io = io
    }

    index = (req: express.Request, res: express.Response) => {

        const dialogId: any = req.query.dialog;

        MessageModel.find({ dialog: dialogId })
            .populate(['dialog'])
            .exec(function (err, messages) {
                if (err) {
                    return res.status(404).json({
                        message: 'Messages not found',
                    });
                }
                return res.json(messages);
            });
    }

    show(req: express.Request, res: express.Response) {
        const id: string = req.params.id;

        MessageModel.findById(id, (err: any, user: any) =>{
            if(err) {
                res.status(404).json({
                    message: "Message not found"
                })
            }
            res.json(user);
        });
    }

    create = (req: any, res: express.Response) => {

        const userId = req.user._id;

        const postData = {
            text: req.body.text,
            user: userId,
            dialog: req.body.dialog_id,
        };

        const message = new MessageModel(postData);

        message
            .save()
            .then((obj: any) => {
                console.log(obj)
                obj.populate('dialog', (err: any, message: any) => {
                    if(err) {
                        return res.status(500).json({
                            status: 'error',
                            message: err
                        })
                    }
                    DialogModel.findOneAndUpdate(
                        {_id: postData.dialog},
                        {lastMessage: message._id},
                        {upsert: true},

                        function(err) {
                            if(err) {
                                return res.status(500).json({
                                    status: 'error',
                                    message: err
                                })
                            }
                        }

                    )

                    res.json(message);
                    this.io.emit('SERVER:NEW_MESSAGE', message);
                })
            })
            .catch((reason: any) => {
                res.json(reason)
            });
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;

        MessageModel.findByIdAndDelete(id, (err: any, message: any) =>{
            if(err) {
                res.status(404).json({
                    message: 'Message not found'
                })
            } else {
                res.json({
                    message: `Message removed`
                });
            }
        });
    }

}


export default MessageController
