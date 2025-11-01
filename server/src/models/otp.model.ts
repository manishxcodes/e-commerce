import mongoose, { Schema, Document} from "mongoose";

export interface IOtp extends Document {
    email: string,
    otp: string
}

const otpSchema = new Schema<IOtp>({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
        expireAfterSecond: 180
    }
});

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);