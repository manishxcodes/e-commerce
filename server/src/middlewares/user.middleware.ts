import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./async-handler.ts";
import { AppError } from "utils/AppError.ts";
import { constants } from '../constants/index.ts'

export const isUser = asyncHandler(
    async(req: Request, res: Response, next: NextFunction) => {
        if(!req.user) return next(new AppError("Authentiction required", 401));

        if(req.user.userType !== constants.USER_TYPES.USER) return next(new AppError("Access denied. User privileges required", 403));

        next();
    }
)