import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://vasanthmuthukumar7_db_user:3BvZxvSKMZbMc5rU@cluster0.thqu6ot.mongodb.net/food-delivery').then(() => console.log("DB Connected"));
}