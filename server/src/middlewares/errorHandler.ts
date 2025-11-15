import type { Request, Response, NextFunction } from "express";
import { AppError } from '../utils/AppError.ts';

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    console.log('Error: ', err);

    // handle custom error 
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.details || null,
        });
    }

    // default error 
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}