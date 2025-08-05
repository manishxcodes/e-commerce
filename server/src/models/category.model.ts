import mongoose, { Schema, Document} from 'mongoose';

interface CategoryType extends Document {
    name: string,
    imageUrl?: string,
}

const categorySchema = new Schema<CategoryType>({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        maxlength: 20
    }
}, {timestamps: true});

export const Category = mongoose.model<CategoryType>("Category", categorySchema);