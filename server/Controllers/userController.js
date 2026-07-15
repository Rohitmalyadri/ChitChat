import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import supabase from "../lib/db.js"
import { formatUser } from "../lib/formatHelpers.js"
import bcrypt from "bcryptjs"
import {io} from "../server.js"

// Signup new user
export const signup = async (req,res) => {
    const { fullName, email, password, bio } = req.body
    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({success:false,message:"Missing Details"})
        }
        
        const { data: user, error: findError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle()
        
        if (findError) throw findError
        
        if (user) {
            return res.json({success:false,message:"Account Already Exists"})
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)
        
        const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert([{
                full_name: fullName,
                email,
                password: hashedPassword,
                bio
            }])
            .select()
            .single()

        if (createError) throw createError

        const formattedUser = formatUser(newUser)
        const token = generateToken(formattedUser._id)

        res.json({success:true,userData:formattedUser,token,message:"Account created Successfully"})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}


// Controller function for user login

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data: user, error: findError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle()

        if (findError) throw findError
        
        if (!user) {
            return res.json({success:false,message:"Invalid Credentials"})
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        
        if (!isPasswordCorrect) {
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const formattedUser = formatUser(user)
        const token = generateToken(formattedUser._id)

        res.json({success:true,userData:formattedUser,token,message:"Account login Successfully"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

// Controller to check if user is authenticated

export const checkAuth = (req, res) => {
    res.json({success:true,user: req.user})
}

// Controller to update user profile details

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body
        const userId = req.user._id

        const updateData = { bio, full_name: fullName }

        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic)
            updateData.profile_pic = upload.secure_url
        }

        const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", userId)
            .select()
            .single()

        if (updateError) throw updateError

        res.json({success:true,user:formatUser(updatedUser)})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
} 