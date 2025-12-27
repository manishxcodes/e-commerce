import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "middlewares/async-handler.ts";
import { CartItem, type ICartItem } from "models/cartItem.model.ts";
import { Product, type IProduct } from "models/product.model.ts";
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
            cartItem.priceAtAddTime = product.price;
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
);

export const getCartItems = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;

        const cartItems = await CartItem.find({ user: userId })
            .populate<{product: IProduct}>('product')
            .sort({ createdAt: -1 });

        let subTotal = 0;
        let totalItems = 0;
        const validCartItems = [];

        for(const item of cartItems ) {
            const product = item.product;

            if(!product || !product.isSizeInStock(item.size, item.quantity)) continue;

            const imageUrl = await product.getSignedUrl();

            validCartItems.push({
                _id: item._id,
                product: {
                    _id: product._id, 
                    name: product.name, 
                    brand: product.brand,
                    imageUrl: imageUrl,
                    currentPrice: product.price
                },
                size: item.size,
                quantity: item.quantity,
                priceAtAddTime: item.priceAtAddTime,
                subTotal: item.priceAtAddTime * item.quantity,
                createdAt: item.createdAt
            });

            subTotal += item.priceAtAddTime * item.quantity;
            totalItems += item.quantity;
        }

        return AppResponse.success(
            res,
            "Cart Items fetched successfully",
            { 
                data: { 
                    items: validCartItems, 
                    summary: {
                        totalItems,
                        subTotal,
                        estimatedShipping: subTotal > 1000 ? 0 : 50,
                        estimatedTotal: subTotal + ( subTotal > 1000 ? 0 : 50)
                    }
                } 
            }
        );
    }
);

export const updateCartItemQuantity = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1 || quantity > 10) {
            return next(new AppError("Quantity must be between 1 and 10", 400));
        }

        const cartItem = await CartItem.findOne({
            _id: cartItemId,
            user: userId
        }).populate<{ product: IProduct }>('product');

        if(!cartItem) {
            return next(new AppError("Cart Item not found", 404));
        }

        const product = cartItem.product;

        if(!product.isSizeInStock(cartItem.size, quantity)) {
            return next(new AppError('Insufficient stock for requested quantity', 400));
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return AppResponse.success(res, "Cart item updated successfully", { data: cartItem });
    }
)

export const removeFromCart = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        const { cartItemId } = req.params;

        // get cart item
        const cartItem = await CartItem.findOneAndDelete({
            _id: cartItemId,
            user: userId
        });

        if(!cartItem) return next(new AppError('Cart item not found', 404));

        return AppResponse.success(res, "Item removed from cart");
    }
);

export const clearCart = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;

        await CartItem.deleteMany({ user: userId });

        return AppResponse.success(res, "Cart cleared successfully");
    }
)