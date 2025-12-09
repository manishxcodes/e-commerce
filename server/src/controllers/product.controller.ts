import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "middlewares/async-handler.ts";
import { Product } from "models/product.model.ts";
import { AppError } from "utils/AppError.ts";
import { AppResponse } from "utils/AppResponse.ts";
import { uploadToS3 } from "utils/s3.ts";

export const addProduct = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        if(!req.file) {
            return next(new AppError("Product image is missing", 400));
        }

        // get file and product data
        const { name, description, summary, brand, category, sizes, price, tags, owner } = req.body;
        const file = req.file;
        const ownerId = req.user?.userId

        const imageKey = uploadToS3(file, 'products');
        if(!imageKey) return next(new AppError("Failed to upload image to s3", 500));

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

export const getProduct = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {

    }
);

export const updateProduct = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {

    }
);

export const deleteProduct = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {

    }
);


