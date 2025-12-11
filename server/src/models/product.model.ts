import mongoose, { Schema, Document } from 'mongoose';
import { constants } from "../constants/index.ts"
import { AppError } from 'utils/AppError.ts';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'config/aws.ts';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface IProductSize {
    size: string,
    quantity: number
}
export interface IProduct extends Document {
    name: string,
    description: string,
    summary: string,
    brand: string,
    category: mongoose.Types.ObjectId,
    imageKey: string,
    imageUrl?: string,
    sizes: IProductSize[],
    tags?: string[],
    price: number,
    inStock: boolean,
    owner: mongoose.Types.ObjectId,

    getSignedUrl(): Promise<string>
    isSizeInStock(size: string, requestQuantity: number): boolean,
    updateStockQuantity(size: string, requestQuantity: number): Promise<IProduct>,
    isProductInstock(): boolean
}

const productSchema: Schema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
        maxlength: 80,
    },
    description: {
        type: String,
        maxlength: 1000,
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
        maxlength: 30
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    imageKey: {
        type: String,
        required: true,
    },
    sizes: {
        type: [{
            size: {
                type: String,
                enum: Object.values(constants.PRODUCT_SIZES),
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
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

productSchema.methods.getSignedUrl = async function() {
    const bucketName = process.env.AWS_BUCKET_NAME;

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: this.imageKey
    });

    return await getSignedUrl(s3, command, { expiresIn: 86400});
}

productSchema.methods.isSizeInStock = function(size: string, requestQuantity: number) {
    const productSize = this.sizes.find((s: IProductSize) => s.size === size);

    if(!productSize) return false;

    return productSize.quantity >= requestQuantity;
}

productSchema.methods.updateStockQuantity = async function(size: string, requestQuantity: number) {
    const sizeIndex = this.sizes.findIndex((s: IProductSize)=> s.size === size);

    if(sizeIndex === -1) throw new AppError(`Size ${size} not found for this product`, 404);

    const newQuantity = this.sizes[sizeIndex].quantity + requestQuantity;

    if(newQuantity < 0) throw new AppError(`Insufficient stock for size ${size}.`, 400);

    this.sizes[sizeIndex].quantity = newQuantity;

    const hasStock = this.sizes.some((s: IProductSize) => s.quantity > 0);
    this.inStock = hasStock;

    return await this.save();
}

productSchema.methods.isProductInstock = function () {
    const total = this.sizes.reduce((sum: number, s: IProductSize) => sum + s.quantity, 0);

    this.inStock = total > 0;
};


export const Product = mongoose.model<IProduct>("Product", productSchema);