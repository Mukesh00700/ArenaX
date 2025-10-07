import User from "../models/User.js";
import {upload,cloudinary} from "../config/cloudinary.js"
export const myProfileController = async(req,res)=>{
    try{
        const id = req.user._id;
        const user = await User.findById(id);
        if(!user) return res.status(404).json({msg:"User not found"});
        return res.status(200).json({user}).select("-password");
    }catch(e){
        console.log(e);
        return res.status(500).json({msg:"Server Error"});
    }
}

export const updateProfilePicture = async(req,res)=>{
    try{
        const id = req.user._id;
        const imageUrl = req.file.path;
        if(!imageUrl) return res.status(400).json({msg:"Image url must be provided"});
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: { imageUrl: imageUrl } },
            { new: true }
        ).select('imageUrl');
         return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully.",
            imageUrl: updatedUser.imageUrl
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({msg:"Server Error"});
    }
}