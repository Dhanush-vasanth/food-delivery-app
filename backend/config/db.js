import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
    dotenv.config();
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }
    await mongoose.connect(process.env.MONGO_URI).then(() => console.log("DB Connected"));
}