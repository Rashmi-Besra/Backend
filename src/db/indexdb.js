import mongoose from "mongoose"
import {DB_NAME} from"../constant.js"

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected !! DB HOST:${connectionInstance.connection.host}`); //isse pta chaltah konse host pe connect ho rha h
        
    }catch(error){
        console.log("MONGODB connection error",error);
        process.exit(1) //this kills the node js as if y=there is mongodb failure then backened file should not run at all its useless
        
    }
}

export default connectDB

//mongoose hepls node js file to talk to mongodb