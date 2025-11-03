import type { Response, Request, NextFunction } from "express";
import path from "path";
import { AppError } from "utils/AppError.ts";
import { ZodSchema } from "zod/v3";

export const validate = (
    schema: ZodSchema
) => (
    req: Request, res: Response, next: NextFunction
) => {
    const result = schema.safeParse(req.body);
    if(!result.success) {
        const errorMessage =  result.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        }));

        
        return next(
            new AppError(`Validation failed: ${JSON.stringify(errorMessage)}`, 400)
        );
    }

    req.body = result.data;
    next();
}