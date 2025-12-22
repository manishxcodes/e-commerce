import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "middlewares/async-handler.ts";
import { CartItem } from "models/cartItem.model.ts";
import { Product } from "models/product.model.ts";
import { AppError } from "utils/AppError.ts";
import { AppResponse } from "utils/AppResponse.ts";

export const addToCart = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        // get product and user id
        const userId = req.user?.userId;
        const { productId, size, quantity = 1 } = req.body;
        // 
        // fetch product 
        const product = await Product.findById(productId);
        if(!product) return next(new AppError("Product not found", 404));

        // check if proudct is in stock for requested size
        if(!product.isSizeInStock(size, quantity)) {
            return next(new AppError(`${product.name} size-${size} is not available for the requested quantity`, 400));
        }

        // check if items already in cart 
        let cartItem = await CartItem.findOne({
            user: userId,
            product: productId,
            size: size
        });

        // if yes - update existing cart 
        if(cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if(newQuantity > 10) return next(new AppError("Cannot add more than 10 items of same product", 400));

            if(!product.isSizeInStock(size, newQuantity)) {
                return next(new AppError(`${product.name} size-${size} is not available for the requested quantity`, 400));
            }

            cartItem.quantity = newQuantity;
            cartItem.price = product.price;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                user: userId, 
                product: productId,
                size: size,
                quantity: quantity,
                price: product.price
            });
        }

        // populate product details
        await cartItem.populate('product');

        return AppResponse.success(res, "Item added to cart successfully", { data: cartItem });
    }
)