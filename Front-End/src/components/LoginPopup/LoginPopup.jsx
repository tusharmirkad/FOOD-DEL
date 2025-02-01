import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import axios from 'axios' ;
import { StoreContext } from "../../context/StoreContext";
import {useNavigate} from 'react-router-dom' ;

export default function LoginPopup({ setShowLogin }) {

  const navigate = useNavigate() ;
  const { url, token, setToken } = useContext(StoreContext) ;

  const [currState, SetCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  }) ;

  const onLogin = async(evt) => {

    evt.preventDefault() ;

    let newUrl = url ;

    if(currState == 'Login'){
      newUrl += '/api/user/login'
    }else{
      newUrl += '/api/user/register'
    }

    const response = await axios.post(newUrl, data) ;

    if(response.data.success){
      setToken(response.data.token) ;
      localStorage.setItem("token", response.data.token) ;
      setShowLogin(false) ;
      navigate('/') ;
    }
    else{
      alert(response.data.message) ;
    }
  }

  const onChangeHandler = (evt) => {
    setData((prev) => ({
      ...prev, [evt.target.name]: evt.target.value
    })) 
  }

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input onChange={onChangeHandler} name="name" value={data.name} type="text" placeholder="Your name" required />
          )}
          <input onChange={onChangeHandler} name="email" value={data.email} type="email" placeholder="Your email" required />
          <input onChange={onChangeHandler} name="password" value={data.password} type="password" placeholder="Password" required />
        </div>
        <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy. </p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => SetCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => SetCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}
