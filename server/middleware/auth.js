import jwt from "jsonwebtoken"
import supabase from "../lib/db.js"
import { formatUser } from "../lib/formatHelpers.js"


// Middleware to protect routes


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token

        if (!token) {
            return res.json({success:false,message:"Token must be provided"})
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", decoded.userId)
            .maybeSingle()

        if (error) {
            console.error("Database error in protectRoute:", error.message)
            return res.json({success:false,message:"Database error occurred"})
        }

        if(!user){
            return res.json({success:false,message:"User not Found"})
        }

        // Format user to match original mongoose properties and remove password
        const formattedUser = formatUser(user)
        delete formattedUser.password

        req.user = formattedUser
        next()


    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
} 