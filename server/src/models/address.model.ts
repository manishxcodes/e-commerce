import mongoose, { Document, Schema } from "mongoose";

//Address interface: Defines the TypeScript type for a Address document.
//It extends Mongoose’s Document so we get MongoDB-specific features like _id.

export interface IAddress extends Document {
    houseNumber: string,
    lane: string,
    city: string,
    district: string,
    state: string,
    pincode: string ,
    country: string
}

const addressSchema: Schema = new Schema<IAddress>({
    houseNumber: {
        type: String,
        required: true
    },
    lane: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

export const  Address =  mongoose.model<IAddress>('Address', addressSchema);