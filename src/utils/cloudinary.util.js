import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
   // console.log(localFilePath);
    if (!localFilePath) return null;
    
    // Upload the file to Cloudinary
    //console.log("Uploading file...");
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    
    // File has been uploaded successfully
    //console.log("File uploaded to Cloudinary:", response.url);
    
    // Delete the local file
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};



export {uploadOnCloudinary}