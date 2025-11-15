import { sendOtp, verifyOtp } from "controllers/otp.controller.ts";
import { Router } from "express";
import { validate } from "middlewares/validate.middleware.ts";
import { otpSchema, verifyOtpSchema } from "schema.ts";

const router = Router();

router.post('/send', validate(otpSchema), sendOtp);
router.post('/verify', validate(verifyOtpSchema), verifyOtp);

export default router;