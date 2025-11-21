import type { Response, Request, NextFunction } from "express";
import { asyncHandler } from "middlewares/async-handler.ts";
import { User } from "models/user.model.ts";
import { Address } from "models/address.model.ts";
import { AppError } from "utils/AppError.ts";
import { AppResponse } from "utils/AppResponse.ts";

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, email, password, phoneNumber, userType, photoUrl } = req.body;

        // check if user exists

        // hash password

        // check if otp verified with this email

        // then save data
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
