import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import path from "path";
import adminAuthMiddleware from "../middleware/adminAuth.js";


const foodRouter = express.Router();
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req,file,cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        return cb(null, `${Date.now()}-${path.basename(safeName)}`)
    }
})

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