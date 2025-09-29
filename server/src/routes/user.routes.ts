import userController from "controllers/user.controller.ts";
import { Router } from "express";

const router = Router();

router.get('/:id' , userController.getUserById);

export default router;