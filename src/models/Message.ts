import mongoose, { Schema } from 'mongoose';


export interface IMessage extends Document {
	email: string;
	fullName: string;
	password: string;
	confirmed: boolean;
	avatar: string;
	confirm_hash: string;
	last_seen: Date;
}

const MessageSchema = new Schema({
	author: String,
	partner: String,
	dialog: Date,
	text: String,
	unread: Boolean,
},{
	timestamps: true,
});

const MessageModel = mongoose.model<IMessage>('User', MessageSchema)


export default MessageModel;
