import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" //oimport middleware to read cookies


const app=express()


app.use(cors(
    {
        origin: process.env.CORS_ORIGIN, //kaun kaun sa origin allowed hai
        credentials:true
    }
))
app.use(express.json({limit:"16kb"}))
//this isfor data getting from url
app.use(express.urlencoded({extended:true,limit:"16kb"}))//extend uske krke neted objects user kr skte hain
app.use(express.static("public"))//public assets which containsfiles available for public
app.use(cookieParser())


export { app }