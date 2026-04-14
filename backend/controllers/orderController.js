import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Place user order and create Razorpay order
const placeOrder = async (req, res) => {

  const frontendUrl =  "http://localhost:5174"; // Replace with your actual frontend URL

  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Save order in MongoDB
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Food Processing",
      date: Date.now(),
    });

    await newOrder.save();

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_TEST_API_KEY,
    });
  } catch (error) {
    console.log("Place Order Error:", error);
    res.json({
      success: false,
      message: "Error while placing order",
    });
  }
};

// Verify payment after successful Razorpay payment
const verifyOrder = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
      });

      await userModel.findByIdAndUpdate(userId, {
        cartData: {},
      });

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.log("Verify Order Error:", error);
    res.json({
      success: false,
      message: "Error while verifying payment",
    });
  }
};

//user orders for frontend
const userOrders = async (req, res) =>  {
  try{
    const orders = await orderModel.find({userId:req.body.userId});
    res.json({success:true, data:orders})
  }catch (error) {
    console.log(error)
      res.json({success:false,message:"Error"})
  }
}

//Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error fetching orders"})
  }
}

// api for updating order status
const updateStatus = async (req, res) => {
  try {
      await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
      res.json({success:true, message:"Status updated successfully"})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error updating status"})
  }
}


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };