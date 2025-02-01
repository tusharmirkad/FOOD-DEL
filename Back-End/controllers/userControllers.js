import userModel from '../models/userModel.js' ;
import jwt from 'jsonwebtoken' ;
import bcrypt from 'bcryptjs' ;
import validator from 'validator' ;

const loginUser = async(req, res) => {
    const {email, password} = req.body ;

    try{

        const user = await userModel.findOne({email}) ;

        // check User is present or not
        if(!user){
            return res.json({success: false, message: "User doesn't exist."}) ;
        }

        // check password is match
        const isMatch = await bcrypt.compare(password, user.password) ;

        if(!isMatch){
            return res.json({success: false, message: "Invalid credentials."}) ;
        }

        const token = createToken(user._id) ;
        return res.json({success: true, token}) ;

    }catch(err){
        console.log(err) ;
        return res.json({success: false, message: "Error"}) ;
    }
} ;

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,  { expiresIn: '1h' }) ;
}

const registerUser = async(req, res) => {

    const {name, email, password} = req.body ;
    try{
        // checking email in DB
        const exist = await userModel.findOne({email}) ;
        if(exist){
            return res.json({status: false, message: "User already exists."}) ;
        }

        // validator for email
        if(!validator.isEmail(email)){
            return res.json({status: false, message: "Please enter valid email."}) ;
        }

        if(password.length < 8){
            return res.json({status: false, message: "Password length should be greater tha 8."}) ;
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10) ;
        const hashedPassword = await bcrypt.hash(password, salt) ;

        const newUser = new userModel({
            name: name,
            email, email,
            password: hashedPassword
        }) ;

        const user = await newUser.save() ;
        const token = createToken(user._id) ;
        res.json({success: true, token}) ;

    }catch(err){
        console.log(err) ;
        res.json({success: false, message: "Error"}) ;
    }

} ;

export {loginUser, registerUser} ;