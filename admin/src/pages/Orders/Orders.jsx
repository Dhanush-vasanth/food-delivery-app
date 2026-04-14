import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { assets } from "../../assets/assets"


const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const responce = await axios.get(url+"/api/order/list");
    if(responce.data.success){
      setOrders(responce.data.data);
      console.log(responce.data.data)
    }
    else{
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => {
      const responce = await axios.post(url+"/api/order/status",{
        orderId,
        status: event.target.value
      })
      if(responce.data.success){
        await fetchAllOrders();
        toast.success("Status Updated")
      }
}

  useEffect(()=> {
    fetchAllOrders();
  },[])

  return (
    <div className='order add'>
      <h3>Order page</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                  if(index === order.items.length-1){
                    return item.name + " x " + item.quantity 
                  }
                  else{
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className='order-item-name'>
                {order.address.firstName +"  "+order.address.lastName}
              </p>
              <div className="order-item-adreess">
                <p>{order.address.street +","}</p>
                <p>{order.address.city +", " + order.address.state + ", " + order.address.country+", "+order.address.zipCode}</p>
              </div>
              <p className="order-items-phone">
                {order.address.phone}
              </p>
            </div>
            <p>Items: {order.items.length}</p>
            <p> ${order.amount}</p>
            <select onChange={(event) =>statusHandler(event,order._id)}value={order.status} >
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders