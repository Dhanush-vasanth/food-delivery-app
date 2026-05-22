import React, { use, useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url,setToken} = useContext(StoreContext)
  const navigate = useNavigate();

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipCode:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

 const placeOrder = async (event) => {
  event.preventDefault();

  try {
    if (!token) {
      alert("Please login first");
      navigate('/');
      return;
    }

    if (!food_list || food_list.length === 0) {
      alert("Food list not loaded. Please go back and try again.");
      return;
    }

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] && cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    if (orderItems.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 60,
    };

    console.log("Placing order with data:", orderData);

    const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

    console.log("Order response:", response.data);

    if (!response.data.success) {
      const errorMsg = response.data.message || "Error placing order";
      if (errorMsg.includes("Invalid") || errorMsg.includes("expired")) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        setToken("");
        navigate('/');
      } else {
        alert(errorMsg);
      }
      return;
    }

    const { key, amount, currency, razorpay_order_id, orderId } = response.data;

    const options = {
      key,
      amount,
      currency,
      name: "Food Del",
      description: "Order Payment",
      order_id: razorpay_order_id,
      handler: async function (rzpResponse) {
        try {
        const verifyRes = await axios.post(
          url + "/api/order/verify",
          {
            orderId,
            razorpay_order_id: rzpResponse.razorpay_order_id,
            razorpay_payment_id: rzpResponse.razorpay_payment_id,
            razorpay_signature: rzpResponse.razorpay_signature,
          },
          { headers: { token } }
        );

          if (verifyRes.data.success) {
                window.location.replace(`/verify?success=true&orderId=${orderId}`)
              } else {
                window.location.replace(`/verify?success=false&orderId=${orderId}`)
              }
            } catch (error){
              console.log("Payment Verification Error:", error);
              window.location.replace(`/verify?success=false&orderId=${orderId}`)
            }
      },
      prefill: {
        name: data.firstName + " " + data.lastName,
        email: data.email,
        contact: data.phone,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch(error) {
    console.error("Place order error:", error);
    const errorMsg = error.response?.data?.message || error.message || "Error placing order";
    
    if (error.response?.status === 401 || errorMsg.includes("Invalid") || errorMsg.includes("expired")) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      setToken("");
      navigate('/');
    } else {
      alert(errorMsg);
    }
  }
};

useEffect(() =>{
  if (!token) {
    navigate('/cart')
  }
  else if (getTotalCartAmount() === 0) {
    navigate('/cart')
  }
},[token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipCode' onChange={onChangeHandler} value={data.zipCode} type="text" placeholder='zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone Number' />
      </div>
      <div className="place-order-right">
         <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 60}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 60}</b>
            </div>
          </div>
            <button type='submit' >PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder