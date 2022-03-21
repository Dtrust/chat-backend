import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';


export interface IUser extends Document {
	email: string;
	fullName: string;
	password: string;
	confirmed: boolean;
	avatar: string;
	confirm_hash: string;
	last_seen: Date;
}

const UserSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Email address is required'],
		validate: [isEmail, "Invalid email"],
		unique: true,
	},
	fullName: {
		type: String,
		required: 'Fullname is required',
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
	confirmed_hash: String,
	last_seen: {
		type: Date,
		default: new Date(),
	},
},{
	timestamps: true,
});

const UserModel = mongoose.model<IUser>('User', UserSchema)


export default UserModel;
