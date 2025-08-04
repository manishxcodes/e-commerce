import mongoose, { Document, Schema } from "mongoose";
import { constants } from "../constants/index.ts";

export interface UserType extends Document {
    firstName: string,
    lastName: string,
    address: mongoose.Types.ObjectId,
    email: string,
    password: string,
    phoneNumber: string,
    userType: number
}

const userSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: Number,
        default: constants.USER_TYPES.USER,
        enum: [constants.USER_TYPES.ADMIN, constants.USER_TYPES.USER]
    }
}, {timestamps: true});

export const User = mongoose.model<UserType>('User', userSchema);

