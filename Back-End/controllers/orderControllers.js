
import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) ;

// placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = 'http://localhost:5173';

    // Validate required fields
    if (!req.body.userId || !req.body.items || !req.body.amount || !req.body.address) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required fields" 
        });
    }

    try {
        // Save the new order to the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();

        // Clear the user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare line items for Stripe checkout
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr", // Corrected key
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert to paise
            },
            quantity: item.quantity,
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charges",
                },
                unit_amount: 500, // 5 INR in paise
            },
            quantity: 1,
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Return the session URL to the frontend
        return res.json({ success: true, session_url: session.url });

    } catch (err) {
        console.error("Stripe Checkout Error:", err);
        return res.status(500).json({ 
            success: false, 
            message: err.message || "Error processing payment" 
        });
    }
};
const verifyOrder = async(req, res) => {
    const {orderId, success} = req.body ;
    try{
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment: true}) ;
            res.json({success: true, message: "Paid"});
        }else{
            await orderModel.findByIdAndUpdate(orderId) ;
            res.json({success: true ,message: "Not Paid"});
        }
    }catch(err){
        console.log(err) ;
        res.json({success: false ,message: "Error"});
    }
}

// user order for frontend..

const userOrders = async(req,res) => {
    try{
        const orders = await orderModel.find({userId: req.body.userId}) ;
        res.json({success: true, data: orders}) ;
    }catch(err){
        res.json({success: true, message: "Error"}) ;
    }   
}

// listing orders for admin panel
const listOrders = async(req, res) => {
    try{
        const orders = await orderModel.find({}) ;
        res.json({success: true, data: orders}) ;
    }catch(err){
        console.log(err)
        res.json({success: true, message:"Error"}) ;
    }
}

// api for updating order status

const updateStatus = async(req,res) => {
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status}) ;
        res.json({success: true, message: "Status updated"}) ;
    }catch(err){
        console.log(err) ;
        res.json({success: false, message:"Error"}) ;
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus} ;
