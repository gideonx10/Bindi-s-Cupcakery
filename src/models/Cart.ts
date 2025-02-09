import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for a Cart document.
export interface ICart extends Document {
  user: Types.ObjectId; // Reference to the User collection
  products: { product: Types.ObjectId; quantity: number }[]; // Array of product references with quantity
}

// Create the Cart schema.
const CartSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 0 },
    },
  ],
});

// Export the model (or retrieve it if already defined).
export default mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", CartSchema);
