import {asyncHandler} from"../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadoncloudinar} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        //save refreshtoken in db

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false })

        return{accessToken,refreshToken}

    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

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


const loginuser=asyncHandler(async(req,res)=>{
    //req.body->data
    //username or email
    //find the user
    //password check
    //access and refresh token generate and send to user
    //send cookies

    const {email,username,password} =req.body
    console.log(email);

    
    if(!(username|| email)){
        throw new ApiError(400,"username or email is required")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404,"Invalid user credentials")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInuser=await User.findById(user._id).
    select("-password -refreshToken")

    const options={   //thiscookie can be modified only in server not in frontend
        httpOnly: true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInuser,accessToken, //if user himself  
                refreshToken

            },
            "User logged In Successfully"
        )
    )
})



const loggedoutUser=asyncHandler(async(req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
            },
            {
                new:true
            }
    )
    const options={
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"Usr logged Out"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingrefreshToken=req.cookies.refreshToken|| req.body.refreshToken

    if(!incomingrefreshToken){
        throw new ApiError(401,"Unauthorized Access")
    }

   try {
     const decoded_token=jwt.verify(
         incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET
     )
 
     const user=await User.findById(decoded_token?._id)
 
     if(!user){
         throw new ApiError(401,"Invalid refresh Token")
     }
 
     if(incomingrefreshToken !== user?.refreshToken){
         throw new ApiError(401,"Refresh token is expired or used")
     }
 
     const options={
         httpOnly:true,
         secure:true
     }
 
     const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
 
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken:newrefreshToken},
             "Access token refreshed"
         )
         
     )
 
   } catch (error) {
    throw new ApiError(401,error?.message|| "Invalid refreshToken")
   }
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldpassword,newpassword,confirmpass}=req.body

    // if(!(newpassword==confirmpass)){

    // }
    const user=await User.findById(req.user?._id)
    const ispasswordcorrect=await user.isPasswordCorrect(oldpassword);
    
    if(!ispasswordcorrect){
        throw new ApiError(400,"Invalid password")
    }

    user.password=newpassword
    await user.save({validateBeforeSave:false})

    return res.status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))

    
    
})

const getcurrentuser=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiError(200,req.user,"current user fetched successfully"))
})

const updateAccountdetails=asyncHandler(async(res,req)=>{
    const{fullname,email}=req.body

    if(!fullname||!email){
        throw new ApiError(400,"All fields are required")
    }

   const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            fullname,
            email:email
        }
    },
    {new: true}
).select("-password")

return res
.status(200)
.json(new ApiResponse(200,user,"ACCOUNT details updated successfully"))
   
})

const updateuseravatar=asyncHandler(async(req,res)=>{
    const avatarlocalpath=req.file?.path

    if (!avatarlocalpath) {
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadoncloudinar
    (avatarlocalpath)

    if (!avatar.url) {
         throw new ApiError(400,"errorwhile uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new:true}
    ).select("-password")

      return res
    .status(200)
    .json(
        new ApiResponse(200,user,"avatar updated successfully")
    )
})


const updatecoverimage=asyncHandler(async(req,res)=>{
    const coverimagepath=req.file?.path

   
    const coverimage=await uploadoncloudinar
    (coverimagepath)

     if (!coverimagepath) {
        throw new ApiError(400,"Coverimage  file is missing")        
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimage: coverimage.url
            }

        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"cover image updated successfully")
    )
})





const getuserchannelprofile=asyncHandler(async(req,res)=>{
    const {username}=req.params
    if (!username?.trim) {
        throw new ApiError(400,"username is missing")
    }
    const channel=await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subsciber",
                as:"subscribedto"
            }
        },
        {
            $addFields:{
                subscriberscount:{
                    $size:"$subscribers"

                },
                channelsubscribedtocount:{
                    $size:"$subscribedto"
                },
                issubscribed:{
                    $condition:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subscriberscount:1,
                channelsubscribedtocount:1,
                issubscribed:1,
                avatar:1,
                coverimage:1,
                email:1,

            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,
            "channel does not exists"
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200,"user channel fetched successfully")
    )
})

const getwatchhistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchhistory",
                foreignField:"_id",
                as:"watchhistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:""
                            }
                        }
                    }
                ]
            }
        }
    ]) //user._id gives string

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchhistory,
            "watch history fetched successfully"
        )
    )
})


export {
    registerUser,
    loginuser,
    loggedoutUser,
    refreshAccessToken,
    getcurrentuser,
    updateAccountdetails,
    updateuseravatar,
    updatecoverimage,
    getuserchannelprofile,
    getwatchhistory
} 