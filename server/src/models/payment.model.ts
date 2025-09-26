import  mongoose, { Document, Schema } from "mongoose";
import type { IOrder } from "./order.model.ts";
import type { IUser } from "./user.model.ts";

export interface IPayment extends Document {
    paymentOrderId: string, 
    order: IOrder, 
    user: IUser, 
    isPaymentSuccessful: Boolean
}

const paymentSchema: Schema = new mongoose.Schema<IPayment>({
    paymentOrderId: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        index: true
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        index: true,
    },
    isPaymentSuccessful: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);