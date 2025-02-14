import mongoose, { Schema, Document, Types } from "mongoose";

// Define the interface for an Order document.
export interface IOrder extends Document {
  user: Types.ObjectId;
  products: { product: Types.ObjectId; quantity: number }[];
  totalAmount: number;
  createdAt: Date;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  isPaymentVerified: boolean;
  transactionId?: string;
  customization?: string;
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
    totalAmount: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    isPaymentVerified: { type: Boolean, default: false }, // Added field
    transactionId: { type: String, default: null }, // Optional field
    customization: { type: String, default: null },
  },
  { timestamps: true }
);

// Export the model (or retrieve it if already defined).
export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
