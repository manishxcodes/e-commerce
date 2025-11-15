import { z } from 'zod';

export const signupSchema = z.object({
    firstName: z.string().min(3, "Firstame must be atleast 3 characters long"),
    lastName: z.string().min(3, "Firstame must be atleast 3 characters long"),
    address: z.string().optional(),
    email: z.email("Provide a valid email address"),
    phoneNumber: z.string(),
    userType: z.number()
});

export const otpSchema = z.object({
    email: z.email("Provide a valid email address")
});

export const verifyOtpSchema = z.object({
    email: z.email("Provide a valid email address"),
    otp: z.string().length(6, "OTP must of 6 digits")
})

/**
 * make cart item / orderitem ' use claude for reference
 * // make user controller
 *                  // product , cartItem need some change in mode 
 *                  // mainly in interface replace IUser with mongoose.type.objectId. do same for other
 * // product controller
 * // cart/orderItem controller then order controller
 * // vendor controller
 */
