import { addToCart } from "controllers/cart.controller.ts";
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.middleware.ts";
import { isUser } from "middlewares/user.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { addToCartSchema } from "schema.ts";

const router = Router();

router.post('/add', authMiddleware, isUser, validate(addToCartSchema), addToCart);

export default Router;