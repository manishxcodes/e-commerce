import { type Response } from "express";

export class AppResponse {
    static success(res: Response, message: string, data?: any , statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            ...(data && { data })
        });
    }

    static created(res: Response, message: string, data?: any) {
        return this.success(res, message, data, 201);
    }
}