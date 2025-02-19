import mongoose, { Schema, Document } from "mongoose";

export interface IHomePageConfig extends Document {
  topCategories: mongoose.Types.ObjectId[]; // top 4 category IDs
  topBestsellers: mongoose.Types.ObjectId[]; // top 4 product IDs (bestsellers)
  updatedAt: Date;
}

const HomePageConfigSchema: Schema = new Schema(
  {
    topCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    topBestsellers: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

// Prevent model overwrite on initial compile
const HomePageConfig =
  mongoose.models.HomePageConfig ||
  mongoose.model<IHomePageConfig>("HomePageConfig", HomePageConfigSchema);

export default HomePageConfig;