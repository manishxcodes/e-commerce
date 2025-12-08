import { Router } from "express";
import userRouter from './user.route.ts';
import otpRouter from './otp.route.ts';
import uploadRouter from './product.route.ts';
import addressRouter from './address.route.ts';

const router = Router();

router.use('/user', userRouter);
router.use('/otp', otpRouter);
router.use('/upload', uploadRouter);
router.use('/address', addressRouter)


export default router;