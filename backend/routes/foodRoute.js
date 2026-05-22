import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import adminAuthMiddleware from "../middleware/adminAuth.js";


const foodRouter = express.Router();
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedImageTypes.has(file.mimetype)) {
            return cb(new Error("Only image uploads are allowed"));
        }
        cb(null, true);
    },
})

foodRouter.post("/add", adminAuthMiddleware, upload.single("image"), addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove", adminAuthMiddleware, removeFood)



export default foodRouter;