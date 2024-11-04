import { cloudinaryInstance } from "../config/cloudinary.js"

export const imageUploadCloudinary = async (path) => {
    try {
        const uploadResult = await cloudinaryInstance.uploader.upload(path);
        return uploadResult.url;
    } catch (error) {
        console.error("Image upload failed", 'Cloudinary upload Error:', error)
    }
}