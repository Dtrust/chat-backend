import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import { generatePasswordHash } from "../utils";


export interface IUser extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    confirmed: boolean;
    avatar: string;
    confirm_hash: string;
    last_seen: Date;
    data?: IUser;
}

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        validate: [isEmail, "Invalid email"],
        unique: true,
    },
    username: {
        type: String,
        required: 'Username is required',
    },
    password: {
        type: String,
        required: 'Password is required',
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    avatar: String,
    confirm_hash: String,
    last_seen: {
        type: Date,
        default: new Date(),
    },
    },{
    timestamps: true,
    });

UserSchema.pre<IUser>("save", function(next) {
    const user: IUser = this;

    if (!user.isModified("password")) {
        return next();
    }

    generatePasswordHash(user.password)
        .then( hash => {
            user.password = String(hash);
            generatePasswordHash(user.password)
                .then( hash => {
                    user.confirm_hash = String(hash);
                    next();
                })
        })
        .catch(err => {
            next(err);
        });

});

const UserModel = mongoose.model<IUser>('User', UserSchema)


export default UserModel;
