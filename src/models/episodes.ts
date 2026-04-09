import mongoose from "mongoose";

const episondesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    resources: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.default.model("Episodes", episondesSchema);
