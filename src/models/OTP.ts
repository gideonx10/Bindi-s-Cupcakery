import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 1000),
    index: { expires: "2m" },
  }, // TTL index
});

export default mongoose.models.OTP || mongoose.model("OTP", OTPSchema);
