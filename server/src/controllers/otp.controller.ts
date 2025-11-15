import type { Request, Response, NextFunction } from "express";
import { Otp } from '../models/otp.model.ts';
import nodemailer from 'nodemailer';
import { asyncHandler } from "middlewares/asyncHanlder.ts";
import { generateOTP } from "otp-agent";
import { AppError } from "utils/AppError.ts";
import { AppResponse } from "utils/AppResponse.ts";

// nodemailer transporter
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
    }
})

// POST: Send OTP to email
export const sendOtp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

        // Generate OTP
        const otpCode = generateOTP();

        // Delete any existing OTP for this email
        await Otp.deleteMany({ email });

        // Create new OTP document
        const newOtp = await Otp.create({
            email,
            otp: otpCode,
        });

        if(!newOtp) {
            return next(new AppError("Couldn't generate OTP", 500));
        }

        // Send email
        const mailOptions = {
            from: `"E-commerce:" ${process.env.USER_EMAIL}`,
            to: email,
            subject: "Your OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>OTP Verification</h2>
                    <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otpCode}</strong></p>
                    <p>This code will expire in 3 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent, info: ", info);

            if(!info || info.accepted.length === 0 ) {
                await Otp.findByIdAndDelete(newOtp._id);
                return next(new AppError("Failed to send OTP to your email", 500));
            }

            return AppResponse.success(res, "OTP sent successfully to your email");
        } catch (error) {
            // Delete OTP if email fails to send
            await Otp.findByIdAndDelete(newOtp._id);
            console.log("Error while sending OTP: ", error);
            return next(new AppError("Failed to send OTP to your email", 500));
        }
    }
);

export const verifyOtp = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;

        // find the otp document 
        const otpDoc = await Otp.findOne({ email, otp });

        // check if exist 
        if(!otpDoc) {
            return next(new AppError("Invalid or expired OTP", 400));
        }

        // check if already verified
        if(otpDoc.isOtpVerified === true) {
            return next(new AppError("OTP already verified", 400))
        }

        otpDoc.isOtpVerified = true;
        await otpDoc.save();

        return AppResponse.success(res, "OTP verified successfully");
    }
)
