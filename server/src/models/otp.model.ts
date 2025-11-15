import mongoose, { Schema, Document} from "mongoose";

export interface IOtp extends Document {
    email: string,
    otp: string,
    isOtpVerified: boolean,
    createdAt: Date
}

const otpSchema = new Schema<IOtp>({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
        expireAfterSeconds: 180
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 });

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);