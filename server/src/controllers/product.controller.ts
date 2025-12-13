import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "middlewares/async-handler.ts";
import { Product } from "models/product.model.ts";
import { AppError } from "utils/AppError.ts";
import { AppResponse } from "utils/AppResponse.ts";
import { deleteFromS3, uploadToS3 } from "utils/s3.ts";

export const addProduct = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        if(!req.file) {
            return next(new AppError("Product image is missing", 400));
        }

        // get file and product data
        const { name, description, summary, brand, category, sizes, price, tags, owner } = req.body;
        const file = req.file;
        const ownerId = req.user?.userId

        // upllaod to s3
        let imageKey;
        if(req.file) {
            imageKey = await uploadToS3(file, 'products');
            if(!imageKey) return next(new AppError("Failed to upload image to s3", 500));
        }
        
        // create image
        const product = await Product.create({
            name,
            description, 
            summary,
            brand,
            category,
            imageKey,
            sizes,
            price,
            tags,
            owner: ownerId
        })

        const createdProduct = await Product.findById(product._id);
        if(!createdProduct) return next(new  AppError("Failed to create product. Please try again", 500));

        return AppResponse.created(res, "Product created successfully", product);
    }
);

export const getAllProducts = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {

    }
);

export const getProductById = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if(!id) return next(new AppError("Product id is missing", 400));

        const product = await Product.findById(id).select('-sizes._id');
        if(!product) return next(new  AppError("Product not found", 404));
    
        const imageUrl = await product.getSignedUrl();
        
        const formatterProduct = { ...product.toObject(), imageUrl }

        return AppResponse.success(res, "Product found", {product: formatterProduct});
    }
);

export const updateProduct = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        // get id and check 
        const { id } = req.params;
        const userId = req.user?.userId;

        if(!id) return next(new AppError("Product id is missing", 404));
        
        // check product exist
        const product = await Product.findById(id);
        if(!product) return next(new AppError("Product not found", 404));

        // check if the current admin is authorize to update this
        if(product.owner.toString() !== userId) {
            return next(new AppError("You are not allowed to update product", 403));
        }

        // get old imageKey and replace with new one
        let imageKey = product.imageKey;
        if(req.file) {
            const newImageKey = await uploadToS3(req.file, "products");
            if(!newImageKey) return next(new AppError("Failed to update image. Try again", 500));

            // if we get new image delete previous image from s2
            if(imageKey) {
                try {
                    await deleteFromS3(imageKey);
                } catch(err) {
                    console.log("failed to delete old image: ", err);
                }
            }
            imageKey = newImageKey;
        }

        const updatedBody = { ...req.body, imageKey };
        // if new imageKey update the proudct or else thorw error
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            updatedBody,
            { new: true }
        );

        return AppResponse.success(res, "Product updated successfully", updatedProduct);
    }
);

export const deleteProduct = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = req.user?.userId;

        if(!id) return next(new AppError("Product not found", 404));

        const product = await Product.findById(id);
        if(!product) return next(new AppError("Product not found", 404));

        // check if the user is authorize to delete product
        if(product.owner.toString() !== userId) {
            return next(next(new AppError("You are not allowed to delete product")));
        }

        // delete from db and s3
        await Product.findByIdAndDelete(id);

        await deleteFromS3(product.imageKey);

        return AppResponse.success(res, "Product deleted successfully");
    }
);

export const updateProductStock = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { size, quantity } = req.body;
        const { id } = req.params;
        const userId = req.user?.userId;

        if(!id) return next(new AppError("Product not found", 404));


        // check product exist
        const product = await Product.findById(id);
        if(!product) return next(new AppError("Product not found", 404));

        // check if the current admin is authorize to update this
        if(product.owner.toString() !== userId) {
            return next(new AppError("You are not allowed to update product", 403));
        }        

        const updatedProduct = await Product.findOneAndUpdate(
            { 
                _id: id,
                "sizes.size": size
            },
            {
                $set: { "sizes.$.quantity": quantity }
            }, 
            {
                new: true
            }
        )

        if(!updatedProduct) return next(new AppError("Product of this size is not found", 404));

        return AppResponse.success(res, `Update stock of size: ${size} to ${quantity}`, {data: updatedProduct})
    }
)


