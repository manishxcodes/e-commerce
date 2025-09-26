import mongoose, { Document, Schema } from "mongoose";
import type { IProduct } from "./product.model.ts";
import type { IUser } from "./user.model.ts";
import { constants } from "../constants/index.ts";

export interface ICartItem extends Document {
    product: IProduct,
    quantity: Number,
    amount: string
    user: IUser,
    size: string,
    summary: string, 
    title: string,
    image: string,
}

const cartItemSchema: Schema = new mongoose.Schema<ICartItem>({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    }, 
    quantity: {
        type: Number,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    }, 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
        index: true
    }, 
    size: {
        type: String,
        enum: Object.values(constants.PRODUCT_SIZES)
    },
    summary: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },  
}, {timestamps: true});

export const Cart = mongoose.model<ICartItem>("Cart", cartItemSchema);

