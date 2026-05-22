import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify';

const Add = ({ url }) => {


  const [image,setImage] = useState(false)
  const [data,setData] = useState({
    name:"",
    description:"",
    price:"" ,
    category:"Salad"
  })
  

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data,[name]:value}))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    // Validate inputs
    if(!image) {
      toast.error("Please select an image");
      return;
    }
    
    if(!data.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if(!data.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    
    if(!data.price || data.price <= 0) {
      toast.error("Valid product price is required");
      return;
    }
    
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("image", image)
    
    try {
      console.log("Adding food with data:", { name: data.name, category: data.category, price: data.price });
      
      const response = await axios.post(`${url}/api/food/add`, formData);
      
      console.log("Response:", response.data);
      
      if(response.data.success){
        setData({
          name:"",
          description:"",
          price:"" ,
          category:"Salad"
        })
        setImage(false)
        toast.success(response.data.message)
      }
      else{
        toast.error(response.data.message || "Failed to add food item")
      }
    } catch(error) {
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        responseData: error.response?.data
      });
      
      if(error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Not authorized. Please login again.");
      } else if(error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Failed to add food item")
      }
    }
  }


  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col" >
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
          </label>
          <input onChange={(e) =>setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here...' />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here...' required />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler}  name="category">
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₹200' />
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  )
}

export default Add