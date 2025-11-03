import mongoose, { Schema, Document} from 'mongoose';

export interface ICategory extends Document {
    name: string,
    imageUrl?: string,
    parent?: mongoose.Types.ObjectId,
    gender?: "men" | "women" | ""
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        maxlength: 20
    },
    imageUrl: {
        type: String
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    gender: {
        type: String, 
        enum: ["men", "women", ""],
        default: ""
    }
}, {timestamps: true});

export const Category = mongoose.model<ICategory>("Category", categorySchema);