export class AppError extends Error {
    statusCode: number;
    details?: any

    constructor (message: string, statusCode = 500, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;

        Object.setPrototypeOf(this, AppError.prototype);
    }
}