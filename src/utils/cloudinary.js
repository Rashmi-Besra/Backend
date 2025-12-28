import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadoncloudinar = async (localfilepath) => {
  try {
    if (!localfilepath) return null;

    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });

    // delete local file AFTER successful upload
    if (fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }

    return response;
  } catch (error) {
    // delete local file ONLY if it exists
    if (localfilepath && fs.existsSync(localfilepath)) {
      fs.unlinkSync(localfilepath);
    }

    //throw error;// let asyncHandler handle it
    console.error("🔥 CLOUDINARY REAL ERROR 🔥");
  console.error(error);

  throw error;
  }
};


console.log(
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
);

export { uploadoncloudinar };
