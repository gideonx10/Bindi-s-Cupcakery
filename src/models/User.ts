import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  area: string;
  role: "user" | "admin";
  provider?: "google" | "facebook" | "credentials";
  profileComplete: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    area: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    provider: {
      type: String,
      enum: ["google", "facebook", "credentials"],
      default: "credentials",
    },
    profileComplete: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
