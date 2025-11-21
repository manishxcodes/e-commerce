import { findUserByEmail, login } from "controllers/user.controller.ts";
import { Router } from "express";
import { isAdmin } from "middlewares/admin.middleware.ts";
import { authMiddleware } from "middlewares/auth.middleware.ts";
import { isUser } from "middlewares/user.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { signinSchema } from "schema.ts";

const router = Router();

router.get('/:email', authMiddleware, findUserByEmail);
router.post('/login', validate(signinSchema), login);

export default router;