import express from 'express'

import { DialogModel, MessageModel } from '../models';


class DialogController {

    io: any

    constructor(io: any) {
        this.io = io
    }

    index = (req: any, res: express.Response) => {

        const userId: string = req.user._id;

        DialogModel.find()
            .or([{author: userId}, {partner: userId}])
            .populate(['author', 'partner'])
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'user',
                },
            })
            .exec(function (err, dialogs) {
                if (err) {
                    return res.status(404).json({
                        message: 'Dialogs not found',
                    });
                }
                return res.json(dialogs);
            });
    }

    show(req: express.Request, res: express.Response) {
        const id: string = req.params.id;

        DialogModel.findById(id, (err: any, user: any) =>{
            if(err) {
                res.status(404).json({
                    message: "Dialog not found"
                })
            }
            res.json(user);
        });
    }

    create = (req: any, res: express.Response) => {
        const postData = {
            author: req.user._id,
            partner: req.body.partner,
        };

        const dialog = new DialogModel(postData);

        dialog
            .save()
            .then((dialogObj: any) => {
                console.log(dialogObj)

                const message = new MessageModel({
                    text: req.body.text,
                    dialog: dialogObj._id,
                    //Todo check this problem with USER
                    user: req.user._id,
                });

                message
                    .save()
                    .then(() => {
                        dialogObj.lastMessage = message._id;
                        dialogObj.save().then(() => {
                            res.json({dialog: dialogObj});
                            this.io.emit("SERVER:DIALOG_CREATED", {
                                ...postData,
                                dialog: dialogObj
                            });
                        })
                    })
                    .catch((reason: any) => {
                        res.json(reason)
                    });

            })
            .catch((reason: any) => {
                res.json(reason)
            });
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;

        DialogModel.findByIdAndDelete(id, (err: any, dialog: any) =>{
            if(err) {
                res.status(404).json({
                    message: 'Dialog not found'
                })
            } else {
                res.json({
                    message: `Dialog removed`
                });
            }
        });
    }

}


export default DialogController
