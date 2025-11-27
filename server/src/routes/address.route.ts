// address.route.ts
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.middleware.ts";
import {
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress
} from "controllers/address.controller.ts";

const router = Router();

router.post("/", authMiddleware, addAddress);
router.get("/", authMiddleware, getAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
