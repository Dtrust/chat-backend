import express from 'express'

import { DialogModel } from '../models';


class DialogController {

    index(req: express.Request, res: express.Response) {

        const authorId: string = req.params.id;

        DialogModel.find()
            .or([{author: authorId}, {partner: authorId}])
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

        // DialogModel.findById({author: authorId}, (err: any, dialogs: any) =>{
        //     if(err) {
        //         res.status(404).json({
        //             message: "Dialog not found"
        //         })
        //     }
        //     res.json(dialogs);
        // });
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

    create(req: express.Request, res: express.Response) {
        const postData = {
            author: req.body.author,
            partner: req.body.partner,
        };

        const dialog = new DialogModel(postData);

        dialog
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

        DialogModel.findByIdAndDelete(id, (err: any, user: any) =>{
            if(err) {
                res.status(404).json({
                    message: 'Dialog not found'
                })
            } else {
                res.json({
                    message: `Dialog ${user.fullName} removed`
                });
            }
        });
    }

}


export default DialogController
