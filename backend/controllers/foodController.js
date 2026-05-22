import { error } from "console";
import foodModel from "../models/foodModel.js";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//add food item

const addFood = async (req, res) => {
    if (!req.file) {
        console.log("No file uploaded");
        return res.json({success:false,message:"Image is required"})
    }
    
    try {
        console.log("Starting Cloudinary upload...");
        console.log("File buffer size:", req.file.buffer.length);
        console.log("Cloudinary config:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? "****" : "NOT SET"
        });
        
        // Upload buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                {
                    folder: "food_delivery",
                    resource_type: "auto"
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    }
                    else {
                        console.log("Cloudinary upload success:", result.secure_url);
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer);
        });

        const food = new foodModel ({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: result.secure_url  // Store full URL from Cloudinary
        })
        
        console.log("Saving food to DB:", food);
        await food.save();
        console.log("Food saved successfully");
        res.json({success:true,message:"Food Added"})

    }catch(error){
        console.log("Error saving food:", error);
        res.json({success:false,message:error.message || "Error in adding food"})
    }
}

//all  food list
const listFood = async (req, res) => {
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods })
    }catch(error){
        res.json({success:false, message:"Error"})
    }
}

//remove food item

const removeFood = async (req, res) => {
    try{
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({success:false, message:"Food not found"})
        }

        // Delete from Cloudinary if it's a Cloudinary URL
        if (food.image && food.image.includes("cloudinary")) {
            const publicId = food.image.split('/').pop().split('.')[0];
            await cloudinary.v2.uploader.destroy(`food_delivery/${publicId}`);
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message: "Food removed"})

    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error removing food"})
    }
}

export { addFood, listFood, removeFood};