const cloudinary = require('cloudinary').v2;
const fs = require('fs');
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// export const uploadImage = async (req, res) => {
//   try {
//     const fileStr = req.body.data;
//     const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
//       upload_preset: 'dev_setups',
//     });
//     res.status(200).json({ message: "Image uploaded successfully", data: uploadedResponse });
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred", error });
//   }
// };

const uploadImage = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("No file path provided");
        }
        // Upload image to cloudinary
        const res =await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("Image uploaded successfully" , res.url);
        return res;
        
    } catch (error) {
        // remove file if upload fails
        fs.unlinkSync(localFilePath);
        return error;
        
    }
}

module.exports= uploadImage;