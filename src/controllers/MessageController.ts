import express from 'express'

import { MessageModel } from '../models';


class MessageController {

    index(req: express.Request, res: express.Response) {

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


            //
            // .or([{dialog: dialogId}])
            // .populate(['author', 'partner'])
            // .populate({
            //     path: 'lastMessage',
            //     populate: {
            //         path: 'user',
            //     },
            // })
            // .exec(function (err, dialogs) {
            //     if (err) {
            //         return res.status(404).json({
            //             message: 'Messages not found',
            //         });
            //     }
            //     return res.json(dialogs);
            // });

        // MessageModel.findById({author: authorId}, (err: any, dialogs: any) =>{
        //     if(err) {
        //         res.status(404).json({
        //             message: "Message not found"
        //         })
        //     }
        //     res.json(dialogs);
        // });
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

    create(req: express.Request, res: express.Response) {

        const userId = '623336cb6dea0b7cb76f7a07';

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
                res.json(obj)
            })
            .catch((reason: any) => {
                res.json(reason)
            });
    }

    delete(req: express.Request, res: express.Response) {
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
