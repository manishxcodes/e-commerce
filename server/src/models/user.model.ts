import mongoose, { Document, Schema } from "mongoose";
import { constants } from "../constants/index.ts";

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    address?: mongoose.Types.ObjectId,
    email: string,
    phoneNumber: string,
    userType: number,
    photoUrl?: string
}

const userSchema: Schema = new Schema<IUser>({
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
    userType: {
        type: Number,
        default: constants.USER_TYPES.USER,
        enum: [constants.USER_TYPES.ADMIN, constants.USER_TYPES.USER]
    }, 
    photoUrl: {
        type: String, 
    }
}, {timestamps: true});

export const User = mongoose.model<IUser>('User', userSchema);

