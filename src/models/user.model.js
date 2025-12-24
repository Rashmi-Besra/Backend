import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken" //jwt is a bearer token
import bcrypt from "bcrypt"

const userS=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase: true,
            trim: true
        },
        fullname:{
            type:String,
            required:true,
            trim: true,
            index: true
        },
        avatar:{
            type: String, //cloudinary url
            required: true
        },
        coverimage:{
            type: String
        },
        watchhistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type: String,
            required: [true,'Password is required'],
            unique:true,
        },
        refreshtoken:{
            type: String
        }
},
{
    timestamp:true
}
)

userS.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userS.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userS.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userS.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)


