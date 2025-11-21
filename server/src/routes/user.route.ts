import { findUserByEmail, login, logout, registerUser } from "controllers/user.controller.ts";
import { Router } from "express";
import { isAdmin } from "middlewares/admin.middleware.ts";
import { authMiddleware } from "middlewares/auth.middleware.ts";
import { isUser } from "middlewares/user.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { loginSchema, registerSchema } from "schema.ts";

const router = Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authMiddleware, logout);
router.get('/:email', authMiddleware, findUserByEmail);

export default router;