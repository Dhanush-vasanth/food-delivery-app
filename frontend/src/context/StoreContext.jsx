import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext  = createContext(null)

const StoreContextProvider = (props) => {
    
    const [cartItems, setCartItems] = useState({});
    const url = "https://food-delivery-app-e4z1.onrender.com";
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);
    
    // Add Items to Cart
    const addToCart = async (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    // Remove Items from Cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) =>({...prev,[itemId]: prev[itemId]-1}))
        if(token) {
            await axios.post (url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0 ) {
                let itemInfo = food_list.find((product) => product._id === item);
                if(itemInfo && itemInfo.price) {
                    totalAmount += itemInfo.price * cartItems[item]
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url+"/api/food/list");
            console.log("Food list response:", response.data);
            
            if(response.data.success && Array.isArray(response.data.data)) {
                setFoodList(response.data.data);
            } else if(Array.isArray(response.data.data)) {
                setFoodList(response.data.data);
            } else {
                console.error("Unexpected response format:", response.data);
                setFoodList([]);
            }
        } catch(error) {
            console.error("Error fetching food list:", error.message);
            setFoodList([]);
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
            if(response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch(error) {
            console.error("Error loading cart data:", error.message);
        }
    }

    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            if(localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>


    )

}

export default StoreContextProvider;
