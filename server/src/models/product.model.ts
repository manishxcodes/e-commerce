import mongoose, { Schema, Document } from 'mongoose';
import { constants } from "../constants/index.ts"

interface ProductType extends Document {
    title: string,
    description: string,
    brand: string,
    category: mongoose.Types.ObjectId,
    images: string[],
    sizes: {
        size: string,
        quantity: number,
    }[],
    tags?: string[],
    price: number,
    inStock: boolean
}

const productSchema: Schema = new Schema<ProductType>({
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
    images: [{
        type: String
    }],
    sizes: [{
        size: {
            type: String,
            enum: Object.values(constants.PRODUCT_SIZES)
        },
        quantity: {
            type: Number
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
    }
}, {timestamps: true});

export const Product = mongoose.model<ProductType>("Product", productSchema);