import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import {useNavigate} from 'react-router-dom' ;
import {toast} from 'react-toastify'


export default function PlaceOrder() {
  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext) ;
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country:"",
    phone: ""
  }) ;

  const onChangeHandler = (evt) => {
    setData((prev) => ({
      ...prev,
      [evt.target.name]:evt.target.value
    })) ;
  }

  const placeOrder = async(evt) => {
    evt.preventDefault() ;

    // let orderItems = [] ;
    // food_list.map((item) => {
    //   if(cartItems[item._id] > 0){
    //     let itemInfo = { ...item, quantity: cartItems[item._id] };
    //     itemInfo["quantity"] = cartItems[item._id] ;
    //     orderItems.push(itemInfo) ;
    //   }
    // })
    
    // let orderData = {
    //   userId: token?.userId,
    //   address : data,
    //   items: orderItems,
    //   amount: getTotalCartAmount() + 5,
    // }


    // try {
    //   let response = await axios.post(url+'/api/order/place', orderData, {
    //     headers: { token },
    //   });
    
    //   if (response.data.success) {
    //     const { session_url } = response.data;
    //     window.location.replace(session_url);
    //   } else {
    //     console.log("An error occurred while processing your order.");
    //     alert("Functionality Not added");
    //   }
    // } catch (error) {
    //   console.error("Error placing order:", error);
    //   alert("An error occurred while placing your order. Please try again later.");
    // }
    toast.success("Coming Soon !!") ;
  } 

  const navigate = useNavigate() ;

  useEffect(() => {
    if(!token){
      navigate('/cart')
    }else if(getTotalCartAmount() == 0  ){
      navigate('/cart')
    }
   
  })

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required onChange={onChangeHandler} name="firstName" value={data.firstName} type="text" placeholder="First name" />
          <input required onChange={onChangeHandler} name="lastName" value={data.lastName} type="text" placeholder="Last name" />
        </div>
        <input required onChange={onChangeHandler} name="email" value={data.email} type="email" placeholder="Email address" />
        <input required onChange={onChangeHandler} name="street" value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required onChange={onChangeHandler} name="city" value={data.city} type="text" placeholder="City" />
          <input required onChange={onChangeHandler} name="state" value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required onChange={onChangeHandler} name="zipcode" value={data.zipcode} type="text" placeholder="Zip code" />
          <input required onChange={onChangeHandler} name="country" value={data.country} type="text" placeholder="Country" />
        </div>
        <input required onChange={onChangeHandler} name="phone" value={data.phone} type="text" placeholder="Phone" />
      </div>
      <div className="place-order-right">
      <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
          <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()==0?0:5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount()==0?0 : getTotalCartAmount()+5}</p>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
}
