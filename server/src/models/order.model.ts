import mongoose, { Document, Schema } from "mongoose";
import type { ICartItem } from "./cartItem.model.ts";
import type { IUser } from "./user.model.ts";
import { constants } from "../constants/index.ts"

export interface IOrder extends Document {
    orderId: string,
    products: ICartItem[],
    user: IUser,
    totalAmount: string,
    subTotal: string,
    discount: string,
    shippingFee: string,
    paymentMode: string,
    paymentId: string,
    status: string,
}

const orderSchema: Schema = new mongoose.Schema<IOrder>({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    products: [{
        type: mongoose.Schema.ObjectId,
        ref: "CartItem"
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        index: true
    },
    totalAmount: {
        type: String,
        required: true,
    },
    subTotal: {
        type: String,
        required: true,
    },
    discount: {
        type: String,
        required: true,
    },
    shippingFee: {
        type: String,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: Object.values(constants.PAYMENT_MODE),
        required: true
    },
    paymentId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: Object.values(constants.ORDER_STATUS)
    }
}, {timestamps: true});

export const Order = mongoose.model<IOrder>("Order", orderSchema);