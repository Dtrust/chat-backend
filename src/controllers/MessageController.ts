import express from 'express'

import { MessageModel, DialogModel } from '../models';


class MessageController {

    io: any;

    constructor(io: any) {
        this.io = io
    }

    index = (req: any, res: express.Response) => {

        const dialogId: any = req.query.dialog;
        const userId: any = req.user._id;

        MessageModel.updateMany( { dialog: dialogId, user: {$ne: userId } }, { "$set": { unread: false } }, (err: any) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: err,
                });
            }
        });

        MessageModel.find({ dialog: dialogId })
            .populate(['dialog', 'user', 'attachments'])
            .exec(function (err, messages) {
                if (err) {
                    return res.status(404).json({
                        status: 'error',
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
            attachments: req.body.attachments
        };

        const message = new MessageModel(postData);

        message
            .save()
            .then((obj: any) => {

                if (req.body.attachments) {
                    obj.attachments.push()
                }

                obj.populate(['dialog', 'user', 'attachments'], (err: any, message: any) => {
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

    delete = (req: any, res: express.Response) => {

        const id: string = req.query.id;
        const userId: string = req.user._id;

        MessageModel.findById(id, (err: any, message: any) =>{
            if(err || !message) {
                res.status(404).json({
                    status: 'error',
                    message: `Message not found`,
                })
            }

            if (message.user.toString() === userId) {

                const dialogId = message.dialog;

                //Todo fix the created_at string, because if we are deleted message, lastMessage === first message of Dialog
                MessageModel.findOne({dialog: dialogId}, {}, { sort: { 'createdAt': -1 } }, (err, lastMessage) => {
                    if (err) {
                        res.status(500).json({
                            status: 'error',
                            message: err,
                        })
                    }

                    DialogModel.findById(dialogId, (err: any, dialog: any) => {
                        if (err) {
                            res.status(500).json({
                                status: 'error',
                                message: err,
                            })
                        }

                        dialog.lastMessage = lastMessage;
                        dialog.save();
                    })
                })

                message.remove()
                return res.json({
                    status: 'success',
                    message: 'Message deleted'
                })
            } else {
                return res.status(403).json({
                    status: 'error',
                    message: 'Not have permission',
                })
            }
        });

        // const id: string = req.params.id;
        // const userId: string = req.user._id;
        //
        // MessageModel.findByIdAndDelete(id, (err: any, message: any) =>{
        //     console.log()
        //     if (message.user === userId) {
        //         if(err) {
        //             res.status(404).json({
        //                 status: 'error',
        //                 message: `Message removed`
        //             })
        //         } else {
        //             res.json({
        //                 status: 'success',
        //                 message: 'Message deleted',
        //             });
        //         }
        //     }
        // });

    }

}


export default MessageController
