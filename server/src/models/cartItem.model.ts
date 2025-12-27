import mongoose, { Document, Schema } from "mongoose";
import { constants } from "../constants/index.ts";

export interface ICartItem extends Document {
    product: mongoose.Types.ObjectId,
    quantity: number,
    size: string,
    user: mongoose.Types.ObjectId,
    priceAtAddTime: number,

    createdAt: Date,
    updatedAt: Date
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
        min: 1, 
        max: 10
    },
    priceAtAddTime: {
        type: Number,
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
        enum: Object.values(constants.PRODUCT_SIZES),
        required: true
    },  
}, {timestamps: true});

export const CartItem = mongoose.model<ICartItem>("CartItem", cartItemSchema);

