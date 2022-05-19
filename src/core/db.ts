import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

console.log(process.env.MONGO_DB)

mongoose.connect(`mongodb+srv://admin_chat:${process.env.MONGO_DB}@cluster0.dfivd.mongodb.net/chat`);
