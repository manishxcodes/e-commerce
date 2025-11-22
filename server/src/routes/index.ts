import { Router } from "express";
import userRouter from './user.route.ts';
import otpRouter from './otp.route.ts';
import uploadRouter from './upload.route.ts';

const router = Router();

router.use('/user', userRouter);
router.use('/otp', otpRouter);
router.use('/upload', uploadRouter);


export default router;