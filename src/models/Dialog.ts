import mongoose, { Schema } from 'mongoose';

import { IUser } from './User';


export interface IDialog extends mongoose.Document {
	partner: IUser | string;
	author: IUser | string;
}

const DialogSchema = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	partner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	lastMessage: {
		type: Schema.Types.ObjectId,
		ref: 'Message'
	},
},{
	timestamps: true,
});

const DialogModel = mongoose.model<IDialog>('Dialog', DialogSchema)


export default DialogModel;
