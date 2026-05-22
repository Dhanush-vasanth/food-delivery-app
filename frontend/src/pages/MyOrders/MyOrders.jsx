import React, { useEffect, useState } from 'react'
import "./MyOrders.css"
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useContext } from 'react';
import { assets } from '../../assets/frontend_assets/assets';

const MyOrders = () => {


    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);

    const fetchOrders = async () => {
        try {
            console.log("Fetching user orders with token:", token?.substring(0, 20) + "...");
            const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
            console.log("User orders response:", response.data);
            if (response.data.success) {
                setData(response.data.data || []);
            } else {
                console.error("Failed to fetch orders:", response.data.message);
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
            if (error.response?.status === 401) {
                console.error("Unauthorized - token may be expired");
            }
            setData([]);
        }
    }

    useEffect(()=>{
        if (token){
            fetchOrders();
        }
    },[token])

  return (
    <div className='my-orders'>
        <h2>My orders</h2>
        <div className="container">
            {data && data.length > 0 ? (
                data.map((order,index)=>{
                    return (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item,index)=>{
                                if (index === order.items.length-1){
                                    return item.name+" x "+item.quantity
                                }
                                else{
                                    return item.name+" x "+item.quantity+", "
                                }
                            })}</p>
                            <p>₹{order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span><b>{order.status}</b></p>
                            <button onClick={fetchOrders} >Track Order</button>
                        </div>
                    )
                })
            ) : (
                <p style={{textAlign: 'center', padding: '20px'}}>No orders yet</p>
            )}
        </div>
    </div>
  )
}

export default MyOrders