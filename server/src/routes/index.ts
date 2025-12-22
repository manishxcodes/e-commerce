import { Router } from "express";
import userRouter from './user.route.ts';
import otpRouter from './otp.route.ts';
import productRouter from './product.route.ts';
import addressRouter from './address.route.ts';
import cartRouter from './cart.route.ts'

const router = Router();

router.use('/user', userRouter);
router.use('/otp', otpRouter);
router.use('/product', productRouter);
router.use('/address', addressRouter);
router.use('/cart', cartRouter);


export default router;