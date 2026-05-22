 import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// app config
const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// middlewares
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter)
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.get("/test-cloudinary", (req, res) => {
    res.json({
        status: "OK",
        cloudinary_config: {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "NOT SET",
            api_key_set: !!process.env.CLOUDINARY_API_KEY,
            api_secret_set: !!process.env.CLOUDINARY_API_SECRET
        }
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})