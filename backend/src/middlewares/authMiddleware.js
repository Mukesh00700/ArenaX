import jwt from "jsonwebtoken";

export const verifyToken = async (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({msg:"Token must be provided"});
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(err){
        res.status(400).json({ message: "Invalid token" });
    }
}