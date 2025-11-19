import type { Request, Response, NextFunction } from "express"
import { asyncHandler } from "./async-handler.ts"
import { AppError } from "utils/AppError.ts";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { User } from "models/user.model.ts";
import { Types } from 'mongoose';

// extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId?: string,
                userType: number,
                userEmail?: string
            }
        }
    }
}

interface IPayload extends JwtPayload {
    userId: string
}

export const authMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authToken = req.header("Authorization");
        if(!authToken) return next(new AppError("Invalid token. Unauthorized", 401));

        const jwtsecret = process.env.JWT_SECRET!;

        const token = authToken.split(" ")[1];
        if(!token) return next(new AppError("Invalid token", 401));

        const payload= await jwt.verify(token, jwtsecret) as IPayload;
        if(!payload || !payload.userId) return next(new AppError("Invalid token", 401));

        // verify if user exists in db
        const user = await User.findById(payload.userId);
        if(!user) return next(new AppError("Unauthorized", 401)); 

        req.user = {
            userId: (user._id as Types.ObjectId).toString(),
            userEmail: user.email,
            userType: user.userType
        }
    }
)