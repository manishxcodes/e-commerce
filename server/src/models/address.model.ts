import mongoose, { Document, Schema } from "mongoose";

//Address interface: Defines the TypeScript type for a Address document.
//It extends Mongoose’s Document so we get MongoDB-specific features like _id.

export interface IAddress extends Document {
    addressLine1?: string,
    addressLine2?: string,
    houseNumber?: string,
    city: string,
    district: string,
    state: string,
    pincode: string ,
    country: string
}

const addressSchema: Schema = new Schema<IAddress>({
    addressLine1: {
        type: String,
    },
    addressLine2: {
        type: String,
    },
    houseNumber: {
        type: String,
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
},  {timestamps: true});

export const  Address =  mongoose.model<IAddress>('Address', addressSchema);