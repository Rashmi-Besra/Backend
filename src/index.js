//require('dotenv').config({path: './env'})

import dotenv from"dotenv"
import connectDB from "./db/indexdb.js";

dotenv.config({
    path:'./.env'
})

connectDB()






















/*import express from "express"

const app=express()

;(async() => {
    try{
        await mongoose.connect(`${process.env.NONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("express is not able to talk to database:",error);
            throw error
            
        })

        app.listen(process.env.PORT,()=>{
            console.log(`APPis listeening on port ${process.env.PORT}`);
            
        })
    }catch(error){
        console.error("ERROR: ",error)
        throw err
        
    }
})() 
//semicolon se start krte h taki koi error na aaye
//try catch use kro ,database is always in another continent sink await use kro*/