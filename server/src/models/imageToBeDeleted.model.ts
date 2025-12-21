import { constants } from '../constants/index.ts';
import mongoose, { Schema, Document } from 'mongoose';

export interface IImageDeletion extends Document {
    imageKey: string,  
    reason: string,
    attemps: number,
    status: string,
    lastError?: string,
}

const imageDeletionSchema = new Schema<IImageDeletion>({
    imageKey: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        enum: Object.values(constants.IMAGE_DELETION_REASON)
    },
    attemps: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: Object.values(constants.IMAGE_DELETION_STATUS)
    },
    lastError: {
        type: String
    }
}, { timestamps: true });

export const ImageDeletion = mongoose.model<IImageDeletion>("ImageDeletion", imageDeletionSchema);