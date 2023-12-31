import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const UserModel = new Schema({
    profile: String,
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model('user', UserModel);