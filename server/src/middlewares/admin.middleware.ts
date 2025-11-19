import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./async-handler.ts";
import { AppError } from "utils/AppError.ts";
import { constants } from '../constants/index.ts'

export const isAdmin = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        if(!req.user) return next(new AppError("Authentication Required", 401));

        if(req.user.userType !== constants.USER_TYPES.ADMIN) return next(new AppError("Access Denied. Admin privileges required", 403));

        next();
    }
)