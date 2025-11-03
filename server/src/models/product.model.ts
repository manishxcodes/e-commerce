import mongoose, { Schema, Document } from 'mongoose';
import { constants } from "../constants/index.ts"
import type { IUser } from './user.model.ts';

export interface IProduct extends Document {
    title: string,
    description: string,
    summary: string,
    brand: string,
    category: mongoose.Types.ObjectId,
    thumbnail: string,
    images: string[],
    sizes: {
        size: string,
        quantity: number,
    }[],
    tags?: string[],
    price: number,
    inStock: boolean,
    owner: IUser,
}

const productSchema: Schema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        maxLength: 80,
    },
    description: {
        type: String,
        maxLength: 1000,
        required: true
    },
    summary: {
        type: String,
        required: true,
        maxlength: 200
    }
    ,
    brand: {
        type: String,
        required: true,
        maxLength: 30
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        validate: {
            validator: function (val: string[]) {
                return val.length <= 3;
            },
            message: "You can upload a maximum of 3 images per product"
        }
    },
    sizes: [{
        size: {
            type: String,
            enum: Object.values(constants.PRODUCT_SIZES)
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    tags: [{
        type: String,
    }],
    price: {
        type: Number,
        required: true,
        min: 50
    },
    inStock: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

export const Product = mongoose.model<IProduct>("Product", productSchema);