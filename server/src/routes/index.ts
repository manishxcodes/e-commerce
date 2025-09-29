import { Router } from "express";
import userRouter from '../routes/user.routes.ts'

const router = Router();

router.use('/user', userRouter);

export default router;