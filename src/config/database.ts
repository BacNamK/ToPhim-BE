import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

console.log(process.env.MONGODB_URL);

export const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.MONGODB_URL));
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};
