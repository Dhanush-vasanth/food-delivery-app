import React, { use, useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

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

  const orderItems = [];
  food_list.forEach((item) => {
    if (cartItems[item._id] > 0) {
      orderItems.push({ ...item, quantity: cartItems[item._id] });
    }
  });

  const orderData = {
    address: data,
    items: orderItems,
    amount: getTotalCartAmount() + 60,
  };

  const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

  if (!response.data.success) {
    alert("Error placing order");
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
};

const navigate = useNavigate();
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