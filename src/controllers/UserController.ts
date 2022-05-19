import express from 'express';
import bcrypt from "bcrypt";
import { validationResult, Result, ValidationError } from "express-validator";

import { UserModel } from '../models';
import { IUser } from '../models/User';
import { createJWToken } from '../utils';


class UserController {

    io: any

    constructor(io: any) {
        this.io = io
    }

    show = (req: express.Request, res: express.Response) => {
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

    getMe = (req: any, res: express.Response): void => {
        const id: string = req.user && req.user._id;
        UserModel.findById(id, (err: any, user: IUser) => {
            if (err || !user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            res.json(user);
        });
    };

    findUsers = (req: express.Request, res: express.Response): void => {
        const query: any = req.query.query;
        UserModel.find()
            .or([
                { username: new RegExp(query, "i") },
                { email: new RegExp(query, "i") },
            ])
            .then((users: IUser[]) => res.json(users))
            .catch((err: any) => {
                return res.status(404).json({
                    status: "error",
                    message: err,
                });
            });
    };

    create = (req: express.Request, res: express.Response) => {
        const postData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        };

        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            })
        }

        const user = new UserModel(postData);

        user
            .save()
            .then((obj: any) => {
                res.json(obj)
            })
            .catch((reason: any) => {
                res.status(500).json({
                    status: 'error',
                    message: reason
                })
            });
    }

    delete = (req: express.Request, res: express.Response) => {
        const id: string = req.params.id;

        UserModel.findByIdAndDelete(id, (err: any, user: any) =>{
            if(err) {
                res.status(404).json({
                    message: 'User not found'
                })
            } else {
                res.json({
                    message: `User ${user.username} removed`
                });
            }
        });
    }

    login = (req: express.Request, res: express.Response): void => {
        const postData: { email: string; password: string } = {
            email: req.body.email,
            password: req.body.password,
        };

        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({errors: errors.array()});
        } else {
            UserModel.findOne({email: postData.email}, (err: any, user: IUser) => {
                if (err || !user) {
                    return res.json({
                        message: "User not found",
                    });
                }

                if (bcrypt.compareSync(postData.password, user.password)) {
                    const token = createJWToken(user);
                    res.json({
                        status: "success",
                        token,
                    });
                } else {
                    res.json({
                        status: "error",
                        message: "Incorrect password or email",
                    });
                }
            });
        }
    }

    verify = (req: express.Request, res: express.Response): void => {
        const hash = req.query.hash;

        if (!hash) {
            res.status(422).json({errors: 'Invalid Hash'});
        }

        UserModel.findOne({ confirm_hash: hash}, (err: any, user: IUser) => {
            if (err || !user) {
                return res.status(404).json({
                    status: 'error',
                    message: "Hash not found"
                });
            }

            user.confirmed = true;

            user.save(err => {
                if (err) {
                    return res.status(404).json({
                        status: 'error',
                        message: err
                    })
                }

                res.json({
                    status: 'success',
                    message: 'Account verified!'
                });
            })
        });
    }
}


export default UserController
