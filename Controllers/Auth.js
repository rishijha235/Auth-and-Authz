const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

//signup route handler
exports.signup = async(req, res ) => {
    try{
        //get data
        const {name, email, password, role} = req.body;
        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        } 
        //hash password / secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error hashing password"
            });
        }

        // create entry for user
        const user = await User.create({
            name, email, password: hashedPassword, role
        })
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            // data: user
        });
    }
    catch(error){
        console.error("Error:", error); // Log the actual error
        return res.status(500).json({
            success: false,
            message: "User can not be registered, please try again later",
            error: error.message // Show the actual error
        })
    }
}




//login route handler
exports.login =async(req, res) => {
    try{
        //data fetch
        const{email, password} = req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
            success: false,
            message: "Please fill all the details carefully"
            });
        }
        //check if user exists
        let user = await User.findOne({email});
        //if not a registered user
        if(!user){
            return res.status(400).json({
            success: false,
            message: "User not found"
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }
        //verify password and generate a jwt token
        if(await bcrypt.compare(password, user.password)){
            //password match
            let token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: "2h"});

            user = user.toObject();
            user.token = token;
            user.password = undefined;
        
            const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true,
            }

            //parameter for cookie(cookie name, data, options)
            res.cookie("RishiCookie", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully",
                // data: user
            })
        }
        else{
            //password do not match
            return res.status(403).json({
            success: false,
            message: "Incorrect Password"
            });
        }
    }
    catch(error){
        console.error("Error:", error); // Log the actual error
        return res.status(500).json({
            success: false,
            message: "User can not be logged in, please try again later",
            error: error.message // Show the actual error
        })
    }
}