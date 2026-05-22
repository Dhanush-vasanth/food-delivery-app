import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

let razorpay;
if (process.env.RAZORPAY_TEST_API_KEY && process.env.RAZORPAY_SECRET_KEY) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
}

// Place user order and create Razorpay order
const placeOrder = async (req, res) => {

  const frontendUrl =  "https://food-delivery-frontend1-qnbb.onrender.com/"; // Replace with your actual frontend URL

  try {
    const { items, amount, address } = req.body;
    const userId = req.body.userId; // Get from auth middleware

    if (!userId || !items || !amount || !address) {
      return res.json({
        success: false,
        message: "Missing required fields: userId, items, amount, address",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.json({
        success: false,
        message: "Order items cannot be empty",
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

    // Check if Razorpay is configured
    if (!razorpay) {
      return res.json({
        success: false,
        message: "Payment gateway not configured. Please set Razorpay API keys.",
      });
    }

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
      message: error.message || "Error while placing order",
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
    } = req.body;

    const userId = req.body.userId; // Get from authMiddleware

    console.log("Verifying order:", {orderId, userId});

    if (!orderId || !razorpay_order_id) {
      return res.json({
        success: false,
        message: "Missing order or razorpay details",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
      });
      
      console.log("Order payment verified, orderId:", orderId);

      if (userId) {
        await userModel.findByIdAndUpdate(userId, {
          cartData: {},
        });
        console.log("Cart cleared for userId:", userId);
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      console.log("Signature verification failed");
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
      message: error.message || "Error while verifying payment",
    });
  }
};

//user orders for frontend
const userOrders = async (req, res) =>  {
  try{
    const userId = req.body.userId;
    console.log("Fetching orders for userId:", userId);
    if (!userId) {
      return res.json({success:false, message:"User ID not found in request"});
    }
    const orders = await orderModel.find({userId});
    console.log("Found", orders.length, "orders for user", userId);
    res.json({success:true, data:orders})
  }catch (error) {
    console.log("Error fetching user orders:", error);
    res.json({success:false, message:error.message || "Error fetching orders"})
  }
}

//Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    console.log("Fetching all orders for admin");
    const orders = await orderModel.find({});
    console.log("Found", orders.length, "total orders");
    res.json({ success: true, data:orders})
  } catch (error) {
    console.log("Error fetching all orders:", error);
    res.json({success:false, message:error.message || "Error fetching orders"})
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
