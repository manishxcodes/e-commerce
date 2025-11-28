import { z } from 'zod';

// user schema 
export const registerSchema = z.object({
    firstName: z.string().min(3, "Firstame must be atle,ast 3 characters long"),
    lastName: z.string().min(3, "Firstame must be atleast 3 characters long"),
    email: z.email("Provide a valid email address"),
    password: z.string().min(8, "Password must contain atleast 8 characters"),
    phoneNumber: z.string(),
    userType: z.number()
});

export const loginSchema = z.object({
    email: z.email("Provide a valid email address"),
    password: z.string().min(6, "Password must contain atleast 6 characters"),
})


// otp schema
export const otpSchema = z.object({
    email: z.email("Provide a valid email address")
});

export const verifyOtpSchema = z.object({
    email: z.email("Provide a valid email address"),
    otp: z.string().length(6, "OTP must of 6 digits")
})

// address schema
export const addAddressSchema = z.object({
    houseNumber: z.string().min(1, "House number is required").optional(),
    lane: z.string().min(1, "Lane is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(6, "Pincode must be at least 6 digits"),
    country: z.string().min(1, "Country is required"),
});

export const updateAddressSchema = z.object({
    houseNumber: z.string().optional(),
    lane: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
});


/**
 * make cart item / orderitem ' use claude for reference
 * // make user controller
 *                  // product , cartItem need some change in mode 
 *                  // mainly in interface replace IUser with mongoose.type.objectId. do same for other
 * // product controller
 * // cart/orderItem controller then order controller
 * // vendor controller
 */
