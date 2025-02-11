import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for an Order document.
export interface IOrder extends Document {
  user: Types.ObjectId; // Reference to the User collection
  products: { product: Types.ObjectId; quantity: number }[]; // Array of product references with quantity
  totalAmount: number; // Total cost of the order
  createdAt: Date; // Timestamp for when the order was created
  status: "pending" | "shipped" | "delivered" | "cancelled"; // Order status
}

// Create the Order schema.
const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 }, // Total cost of the order
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Export the model (or retrieve it if already defined).
export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
