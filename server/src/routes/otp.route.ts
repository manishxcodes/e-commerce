import { sendOtp } from "controllers/otp.controller.ts";
import { Router } from "express";
import { validate } from "middlewares/validate.middleware.ts";
import { otpSchema, verifyOtpSchema } from "schema.ts";

const router = Router();

router.post('/send', validate(otpSchema), sendOtp);
router.post('/verify', validate(verifyOtpSchema));
router.post('/resend',  validate(otpSchema));

export default router;