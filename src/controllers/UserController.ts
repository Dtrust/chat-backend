import express from 'express'

import { UserModel } from '../models';


class UserController {

    show(req: express.Request, res: express.Response) {
        const id: string = req.params.id;

        UserModel.findById(id, (err: any, user: any) =>{
            if(err) {
                res.status(404).json({
                    message: "User not found"
                })
            }
            res.json(user);
        });
    }

    getMe() {

    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
        };

        const user = new UserModel(postData);

        user
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

        UserModel.findByIdAndDelete(id, (err: any, user: any) =>{
            if(err) {
                res.status(404).json({
                    message: 'User not found'
                })
            } else {
                res.json({
                    message: `User ${user.fullName} removed`
                });
            }
        });
    }

}


export default UserController
