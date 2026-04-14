import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import validator from "validator";


//login user
const loginUser = async (req, res) => {
    const {email,password} = req.body;
    try{
        // checking if user exists
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false, message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false, message:"Invalid credentials"})
        }
        const token = createToken({ id: user._id, role: "user" })
        res.json({success:true, token})

    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Admin login is not configured" });
        }

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Invalid admin credentials" });
        }

        const token = createToken({ id: email, role: "admin" });
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET)
}

//register user
const registerUser = async (req, res) => {
    const{name,password,email} = req.body;
    try{
        // checking if user already exists
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:"User already exists"})
        }
        //validating email and password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Invalid email"})
        }
        // password must be at least 6 characters long
        if(!validator.isLength(password, { min: 6 })){
            return res.json({success:false, message:"Password must be at least 6 characters long"})
        }
        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        // creating user
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken({ id: user._id, role: "user" })
        res.json({success:true,token});

    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export { loginUser, registerUser, adminLogin };