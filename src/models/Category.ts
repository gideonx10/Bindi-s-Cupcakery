import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string; // Optional: URL to an image representing the category.
  isHamperAble: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    isHamperAble: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt.
);

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
