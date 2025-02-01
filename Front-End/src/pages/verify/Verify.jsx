import React, { useContext, useEffect, useState } from "react";
import "./Verify.css";
import StoreContext from "../../context/StoreContext.jsx";
import {useNavigate} from 'react-router-dom' ;
import axios from "axios";

export default function verify() {
  const [searchParams, setSearchParams] = useState();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate() ;

  const verifyPayment = async() => {
    const response = await axios.post(url+'/api/order/verify', {success, orderId}) ;
    if(response.data.success){
        navigate('/myorders') ;
    }else{
        navigate('/') ;
    }
  }

  useEffect(() => {
    verifyPayment() ;
  }, []) ;
  
  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
}
