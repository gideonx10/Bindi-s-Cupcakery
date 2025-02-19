import mongoose from "mongoose";

const MenuImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite upon initial compile
const MenuImage = mongoose.models.MenuImage || mongoose.model("MenuImage", MenuImageSchema);

export default MenuImage;