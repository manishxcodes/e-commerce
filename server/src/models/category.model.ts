import mongoose, { Schema, Document} from 'mongoose';

export interface ICategory extends Document {
    name: string,
    imageUrl?: string,
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        maxlength: 20
    }
}, {timestamps: true});

export const Category = mongoose.model<ICategory>("Category", categorySchema);