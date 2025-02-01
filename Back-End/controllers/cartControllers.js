import userModel from "../models/userModel.js"

// add item to user cart
const addToCart = async( req, res ) => {

    try{
        let userData = await userModel.findById({_id: req.body.userId}) ;
        let cartData = await userData.cartData ;

        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1 ;
        }else{
            cartData[req.body.itemId] += 1 ;    
        }

        await userModel.findByIdAndUpdate(req.body.userId, {cartData}) ;
        return res.json({success: true, message: "Added to cart."}) ;

    }catch(err){
        console.log(err) ;
        return res.json({success: false, message: "Error."}) ;
    }
}

// add item to user cart
const removeFromCart = async( req, res ) => {
    try{
        let userData = await userModel.findById({_id: req.body.userId}) ;
        let cartData = await userData.cartData ;

        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1 ;
        }

        await userModel.findByIdAndUpdate(req.body.userId, {cartData}) ;
        return res.json({success: true, message: "Removed from cart."}) ;

    }catch(err){
        console.log(err) ;
        return res.json({success: false, message: "Error."}) ;
    }
}

// fetch user cart data 
const getCart = async(req, res) => {
    try{
        let userData = await userModel.findById({_id: req.body.userId}) ;
        let cartData = await userData.cartData ;
        
        return res.json({success: true, cartData}) ;

    }catch(err){
        console.log(err) ;
        return res.json({success: false, message: "Error."}) ;
    }
}

export {addToCart, removeFromCart, getCart} ;