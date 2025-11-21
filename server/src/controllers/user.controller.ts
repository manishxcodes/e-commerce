import type { Response, Request, NextFunction } from "express";
import { asyncHandler } from "middlewares/async-handler.ts";
import { User } from "models/user.model.ts";
import { Address } from "models/address.model.ts";
import { AppError } from "utils/AppError.ts";
import { AppResponse } from "utils/AppResponse.ts";
import { Otp } from "models/otp.model.ts";

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, email, password, phoneNumber, userType } = req.body;

        // check if user exists
        const isExistingUser = await User.findOne({email});
        if(isExistingUser) return next(new AppError("User already exists with this email", 409));

        // check if otp verified with this email
        const otp = await Otp.findOne({ email });
        if(!otp?.isOtpVerified) return next(new AppError("OTP not verified",400));

        // then save data
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            userType,
        });

        const createdUser = await User.findById(user._id);
        if(!createdUser) return next(new AppError("Something went wrong while registering user. Please try again", 500));

        return AppResponse.success(res, "User registered successfully");
    }  
); 

export const login = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const jwtsecret = process.env.JWT_SECRET!;

        const user = await User.findOne({ email })
            .select("-__v  -createdAt -updatedAt +password");
        if(!user) return next(new AppError("User not found", 404));

        const isPasswordCorrect = user.isPasswordCorrect(password);
        if(!isPasswordCorrect) return next(new AppError("Invalid password", 400));

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        if(!accessToken && !refreshToken) return next(new AppError("Something went wrong", 500));

        // save refreshToken 
        user.refreshToken = refreshToken;

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                AppResponse.success(res, "Login Successfull", {token: accessToken})
            )
    }
);

export const logout = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        if(!userId) return next(new AppError("Unathorized", 401));

        // remove refresh token
        await User.findByIdAndUpdate(
            userId, 
            { $unset: { refreshToken: ""}},
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true
        }

       return res.status(200)
            .clearCookie("accessToken",  options)
            .clearCookie("refreshToken",  options)
            .json(
                AppResponse.success(res, "Logged Out Successfully")
            );
    }
)

export const findUserByEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.params;

        // check if user exist 
        const user = await User.findOne({ email })
            .populate('address', '-_id -__v')
            .select('-password -__v')
            .lean();
        if(!user) return next(new AppError("User not found", 404));

        const formattedResponse = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoUrl,
            address: user.address,
        }

        return AppResponse.success(res, "User found", formattedResponse);
    }
);
