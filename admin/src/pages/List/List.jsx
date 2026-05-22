import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import {toast} from 'react-toastify';

const List = ({ url }) => {
  

  const [list, setList] = useState([]);


  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data)
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async(foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {id:foodId});
      
      if(response.data.success){
        await fetchList();
        toast.success(response.data.message)
      }
      else{
        toast.error(response.data.message || "Error removing food")
      }
    } catch(error) {
      console.error("Error removing food:", error);
      
      if(error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Not authorized. Please login again.");
      } else if(error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Error removing food")
      }
    }
  }

  useEffect(() => {
    fetchList();
  },[])


  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format  title">
          <b>Image</b>
          <b>Name</b>
          <b>Price</b>
          <b>Category</b>
          <b>Action</b>
        </div>
        {list.map((item,index) => {
          return (
            <div key={index} className='list-table-format' >
              <img src={`${url}/images/`+ item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={()=>removeFood(item._id)} className='cursor' >X</p>
            </div>
          )
        } )}
      </div>
    </div>
  )
}

export default List