import mongoose, { Schema, Document } from "mongoose";

// Define the interface for a Review document.
export interface IReview extends Document {
  userName: string;
  phone: string;
  email: string;
  comment: string;
  isApproved: boolean; // Indicates whether the admin has approved the review for display.
  createdAt: Date;
  updatedAt: Date;
}

// Create the Review schema.
const ReviewSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Export the model.
export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
