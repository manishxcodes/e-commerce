import { addToCart, clearCart, getCartItems, removeFromCart, updateCartItemQuantity } from "controllers/cart.controller.ts";
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.middleware.ts";
import { isUser } from "middlewares/user.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { addToCartSchema } from "schema.ts";

const router = Router();

router.post('/', authMiddleware, isUser, validate(addToCartSchema), addToCart);
router.get('/', authMiddleware, isUser, getCartItems);
router.put('/:cartItemId', authMiddleware, isUser, updateCartItemQuantity);
router.delete('/:cartItemId', authMiddleware, isUser, removeFromCart);
router.delete('/', authMiddleware, isUser, clearCart);

export default Router;