// address.route.ts
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.middleware.ts";
import {
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress
} from "controllers/address.controller.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { addAddressSchema, updateAddressSchema } from "schema.ts";

const router = Router();

router.post("/", authMiddleware, validate(addAddressSchema), addAddress);
router.get("/", authMiddleware, getAddress);
router.put("/:id", authMiddleware, validate(updateAddressSchema), updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
