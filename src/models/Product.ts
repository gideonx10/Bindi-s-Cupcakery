import mongoose, { Schema, Document, Types } from "mongoose";
import { ICategory } from "./Category"; // Optional, for type reference

// Define the interface for a Product document.
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  // Update category to be an ObjectId referencing Category documents.
  category: Types.ObjectId | ICategory;
  images: string[];
  isFeatured: boolean; // Useful for highlighting special or seasonal items.
  customizationOptions?: string[]; // For products like customizable dessert hampers.
  isSugarFree: boolean; // Indicates if the product is sugar free.
  createdAt: Date;
  updatedAt: Date;
}

// Create the Product schema.
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    // Update the category field to be a reference.
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }], // An array of image URLs.
    isFeatured: { type: Boolean, default: false },
    customizationOptions: [{ type: String }],
    isSugarFree: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields.
);

// Export the model (or retrieve it if already defined).
export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
