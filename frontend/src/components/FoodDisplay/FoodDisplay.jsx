import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

  const{food_list} =useContext(StoreContext)

  if (!food_list || !Array.isArray(food_list)) {
    return (
      <div className='food-display' id='food-display'>
        <h2>top dishes near you</h2>
        <div className="food-display-list">
          <p>Loading dishes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='food-display' id='food-display'>
      <h2>top dishes near you</h2>
      <div className="food-display-list">
        {food_list.length === 0 ? (
          <p>No dishes available</p>
        ) : (
          food_list.map((item, index)=>{
            if(!item || !item._id) return null;
            if(category === "All" || item.category === category){
              return <FoodItem key={item._id} id={item._id} name={item.name} price={item.price} description={item.description} image={item.image} />
            }
          })
        )}
      </div>
    </div>
  )
}

export default FoodDisplay