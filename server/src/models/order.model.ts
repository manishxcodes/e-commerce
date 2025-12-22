import mongoose, { Document, mongo, Schema } from "mongoose";
import { constants } from "../constants/index.ts"

export interface IOrderItem {
    product: mongoose.Types.ObjectId,
    productData: {
        name: string,
        imageKey: string, 
        brand: string
    },
    quantity: number,
    size: string,
    price: number,
    subTotal: number
}

export interface IOrder extends Document {
    orderNumber: string,
    items: IOrderItem[],
    user: mongoose.Types.ObjectId,
    shippingAddress: {
        firstName: string,
        lastName: string,
        addressLine1: string,
        addressLine2?: string,
        city: string,
        district: string,
        state: string,
        pincode: string,
        phoneNumber: string
    },
    pricing: {
        subtotal: number, 
        discount: number, 
        shippingFee: number, 
        total: number,
    },
    payment: {
        method: string,
        status: string, 
        razorpayOrderId?: string, 
        razorpayPaymentId?: string,
        razorpaySignature?: string,
        paidAt?: Date,
    }, 
    status: {
        status: string,
        deliveryDate?: Date,
        cancelledAt?: Date, 
        cancellationReason?: string
    }
}

const orderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        productData: {
            name: { type: String, required: true },
            imageKey: { type: String, required: true },
            brand: { type: String, required: true }
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: {
            type: String,
            required: true
        },
        price: {
            type: Number, 
            required: true,
            min: 0
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    },
    pricing: {
        subtotal: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        shippingFee: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 }
    },
    payment: {
        method: {
            type: String, 
            enum: Object.values(constants.PAYMENT_MODE),
            required: true
        },
        status: {
            type: String,
            enum:Object.values(constants.PAYMENT_STATUS) ,
            default: constants.PAYMENT_STATUS.PENDING
        },
        razorpayOrderId: String,
        razorpayPaymentId: String, 
        razorpaySignature: String, 
        paidAt: Date, 
    },
    status: {
        type: String, 
        enum: Object.values(constants.ORDER_STATUS),
        
    }
})