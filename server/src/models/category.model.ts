import mongoose, { Schema, Document} from 'mongoose';

export interface ICategory extends Document {
    name: string,
    imageUrl?: string,
    parentCategory?: mongoose.Types.ObjectId,
    gender?: "men" | "women" | ""
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
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    gender: {
        type: String, 
        enum: ["men", "women", ""],
        default: ""
    }
}, {timestamps: true});

categorySchema.index({ name: 1, gender: 1, parentCategory: 1 }, { unique: true });


export const Category = mongoose.model<ICategory>("Category", categorySchema);