import multer from 'multer';
import type { Request } from 'express';
import { AppError } from 'utils/AppError.ts';

const storage = multer.memoryStorage();

// file filter
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if(allowedMimeType.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files [jpeg, jpg, png] are allowed', 400));
    }
};

export const uploadImageMiddleware = multer({
    storage, 
    fileFilter: imageFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});