import mongoose, { Schema } from 'mongoose';
import format from 'date-fns/format'
import differenceInMinutes from 'date-fns/differenceInMinutes';

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
    isOnline: Boolean,
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

// Todo: this is not good practice
const dateToNumber = (dateStr: string, dateType: string) => {
    if (dateStr) {
        return +format(new Date(dateStr), dateType)
    } else {
        return +format(new Date(), dateType)
    }
}

UserSchema.virtual('isOnline').get(function(this: any) {
    return differenceInMinutes(
        new Date(
            dateToNumber('', 'yyyy'),
            dateToNumber('', 'MM'),
            dateToNumber('', 'dd'),
            dateToNumber('', 'HH'),
            dateToNumber('', 'mm'),
            dateToNumber('', 'ss')
        ),
        new Date(
            dateToNumber(this.last_seen, 'yyyy'),
            dateToNumber(this.last_seen, 'MM'),
            dateToNumber(this.last_seen, 'dd'),
            dateToNumber(this.last_seen, 'HH'),
            dateToNumber(this.last_seen, 'mm'),
            dateToNumber(this.last_seen, 'ss')
        )
    ) < 5;
});

UserSchema.set('toJSON', {
    virtuals: true
});

UserSchema.pre<IUser>("save", function(next) {
    const user: IUser = this;

    if (!user.isModified("password")) {
        return next();
    }

    generatePasswordHash(user.password)
        .then(hash => {
            user.password = String(hash);
            generatePasswordHash(+new Date() + '')
                .then( confirmHash => {
                    user.confirm_hash = String(confirmHash);
                    next();
                })
        })
        .catch(err => {
            next(err);
        });

});

const UserModel = mongoose.model<IUser>('User', UserSchema)


export default UserModel;
