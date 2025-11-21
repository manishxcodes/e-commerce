import mongoose, { Document, Schema } from "mongoose";
import { constants } from "../constants/index.ts";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    address?: mongoose.Types.ObjectId,
    email: string,
    password: string,
    phoneNumber: string,
    userType: number,
    photoUrl?: string,
    refreshToken?: string
    isPasswordCorrect(password: string): Promise<boolean>,
    generateAccessToken(): string,
    generateRefreshToken(): string
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
    password: {
        type: String,
        required: true,
        select: false
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
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true});

userSchema.pre<IUser>("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password =  await bcrypt.hash(this.password , 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password: string) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        userId: this.id,
    }, process.env.ACCESS_TOKEN_SECRET as string,{
        expiresIn: "1h"
    });
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        userId: this._id,
    }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "30d"
    });
}

export const User = mongoose.model<IUser>('User', userSchema);

