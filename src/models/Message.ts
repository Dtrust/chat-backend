import mongoose, { Schema, Document } from "mongoose";
import { IDialog } from "./Dialog";

export interface IMessage extends Document {
	text: string;
	dialog: IDialog | string;
	unread: boolean;
}

const MessageSchema = new Schema(
	{
		text: { type: String, require: Boolean },
		dialog: { type: Schema.Types.ObjectId, ref: "Dialog", require: true },
		user: { type: Schema.Types.ObjectId, ref: "User", require: true },
		unread: {
			type: Boolean,
			default: true,
		},
		attachments: [{ type: Schema.Types.ObjectId, ref: "UploadFile" }],
	},
	{
		timestamps: true,
		// usePushEach: true,
	}
);

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
