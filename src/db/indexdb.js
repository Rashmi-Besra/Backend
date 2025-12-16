import mongoose from "mongoose"
import {DB_NAME} from"../constant.js"

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected !! DB HOST:${connectionInstance.connection.host}`); //isse pta chaltah konse host pe connect ho rha h
        
    }catch(error){
        console.log("MONGODB connection error",error);
        process.exit(1)
        
    }
}

export default connectDB
