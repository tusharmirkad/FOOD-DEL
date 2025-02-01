import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null) ;


const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({}) ;
    const url = "https://food-del-backend-w8qv.onrender.com" ;
    const [token, setToken] = useState("") ;
    const[food_list, setFoodList] = useState([]) ;

    useEffect(() => {
        async function loadData() {
            await fetchFoodList() ;
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token")) ;
                await loadCartData(localStorage.getItem("token")) ;
            } ;
        }
        loadData() ;
    },[]) ;

    const fetchFoodList = async() => {
        const response = await axios.get( url + '/api/food/list') ;
        setFoodList(response.data.data) ;
    }

    const loadCartData = async(token) => {
        const response = await axios.post(url+'/api/cart/get', {}, {headers: {token}}) ;
        setCartItems(response.data.cartData) ;
    }

    const addToCart = async(itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev) => ({...prev, [itemId]:1})) ;
        }else{
            setCartItems((prev) => ({...prev, [itemId]:prev[itemId]+1}))
        }

        if(token){
            await axios.post(url+'/api/cart/add', {itemId}, {headers: {token}}) ;
        }else{
            console.log("Login plz") ;
        }
    }
    
    const removeFromCart = async(itemId) => {
        setCartItems((prev) => ({...prev, [itemId]:prev[itemId]-1})) ;

        if(token){
            await axios.post(url+'/api/cart/remove', {itemId}, {headers: {token}}) ;
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0 ;

        for(const item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = food_list.find((product) => product._id === item) ;
                totalAmount += itemInfo.price *  cartItems[item] ;
            }
        }
        return totalAmount ;
    }

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

export default StoreContextProvider ;
