import type { Response, Request, NextFunction } from "express";
import { AppError } from "utils/AppError.ts";
import { ZodType } from "zod";

export const validate = (
    schema: ZodType
) => (
    req: Request, res: Response, next: NextFunction
) => {
    const result = schema.safeParse(req.body);
    if(!result.success) {
        const errorMessage =  result.error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        }));

        console.log("error: ", errorMessage);
        return next(
            new AppError(`Validation failed:`, 400, errorMessage)
        ); 
    }

    req.body = result.data;
    next();
}