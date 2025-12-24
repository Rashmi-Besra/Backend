//file server pe already aa chuki h  
//ye local file ka path dega o server pe aa chuki h
//file ko cludinary pe dalna h fir remove kr dena h server se

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadoncloudinar=async(localfilepath) =>{
    try{
        if(!localfilepath) return null
        //upload file on cludinary
        const response=await cloudinary.uploader.upload(localfilepath,{
        resource_type:"auto"
        });
        //file uploaded successfully
        console.log("file is uploaded on cloudinary",
        response.url);
        return response
    }catch(error){
        fs.unlinkSync(localfilepath);
        return null;
        //remove thelocally saved temporary file as the upload operation got failed
        }
        
    }

    export {uploadoncloudinar}


