//auth, isStudent, isAdmin
// The auth middleware is used to check if the user is authenticated or not. If the user is authenticated, it will pass the request
// to the next middleware. If not, it will return an error message.
// The isStudent middleware is used to check if the user is a student or not. If the user is a student, it will pass the request
// to the next middleware. If not, it will return an error message.
// The isAdmin middleware is used to check if the user is an admin or not. If the user is an admin, it will pass the request
// to the next middleware. If not, it will return an error message.

const jwt = require("jsonwebtoken");
require("dotenv").config();
 //middleware to check if user is authenticated or not
 exports.auth = (req, res, next) => {
    try{

        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization"));
        
        //extract JWT token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "");

        //check if token exists or not
        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            })
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            req.user = payload; 
        } catch(error){
            console.error("Error:", error);
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            })
        }
        next();

    } catch(error){
        console.error("Error:", error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the token",
            error: error.message
        })
    }
 }

 //Authorization Middleware for Students
 exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only"
            });
        }
        next();

    } catch(error){
        console.error("Error:", error);
        return res.status(401).json({
            success: false,
            message: "User Role is not matching",
            error: error.message  
        })
    }
 }


 //Authorization Middleware for Admins
 exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admins only"
            });
        }
        next();

    } catch(error){
        console.error("Error:", error);
        return res.status(401).json({
            success: false,
            message: "User Role is not matching",
            error: error.message  
        })
    }
 }