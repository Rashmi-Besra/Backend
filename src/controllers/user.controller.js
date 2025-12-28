import {asyncHandler} from"../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadoncloudinar} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";



const registerUser= asyncHandler(async (req,res) =>{
    //get user details from frontend
    //validations
    //check if user already exists:username,email
    //check for images,checkfor avatars
    //upload them to cloudinary,avatar check
    //create user object-to sent to mongodb-create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response 

    const {fullname,email,username,password}=req.body
    console.log("email:", email);

    if(
        [fullname,email,username,password].some((field) =>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverimagelocalpath=req.files?.coverimage[0]?.path;

    if(!avatarlocalpath){
        throw new ApiError(400,"Avatar file is required")
  
    }
    const avatar=await uploadoncloudinar(avatarlocalpath);
    //const coverimage=await uploadoncloudinar(coverimagelocalpath);


    let coverimage;
    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
        coverimage=req.files.coverimage[0].path
    }

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")

    }

    const user=await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    
    const createdUser=await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the error")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})




export {registerUser} 