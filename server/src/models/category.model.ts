import mongoose, { Schema, Document} from 'mongoose';

export interface ICategory extends Document {
    name: string,
    imageUrl?: string,
    parentCategory?: "topwear" | "bottomwear" | "footwear",
    gender?: "men" | "women" | "unisex"
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 20
    },
    imageUrl: {
        type: String
    },
    parentCategory: {
        type: String, 
        enum: ["topwear", "bottomwear", "footwear"]
    },
    gender: {
        type: String, 
        enum: ["men", "women", "unisex"],
        default: ""
    }
}, {timestamps: true});

categorySchema.index({ name: 1, gender: 1, parentCategory: 1 }, { unique: true });


export const Category = mongoose.model<ICategory>("Category", categorySchema);