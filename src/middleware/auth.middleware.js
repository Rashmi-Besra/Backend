import { asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyjwt=asyncHandler(async(req,res,next)=>{  
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") //req has cookies ka access so it can call any cookie so we call accessToken cookie & even check for manual header if there is no accessToken available
    
        if(!token){
            throw new ApiError(401,"Uauthorized  request")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
       const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
    
       if(!user){
        throw new ApiError(401,"Invalid token");
       }
    
       req.user=user;
       next()
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid Access token")
    }


})