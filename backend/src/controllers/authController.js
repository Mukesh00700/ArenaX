import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { loginSchema, singupSchema } from "../validators/authValidator.js";
import sendEmail from "../utils/mailer.js";
import { OAuth2Client } from "google-auth-library"

//Singup(Manual)
export const signup = async(req,res)=>{
    console.log(req.body);
    try{
        //validation using zod
        const validateData = singupSchema.safeParse(req.body);

        if(!validateData.success){
            //Sending field specific errror
            console.log(validateData.error);
            const errors = validateData.error.errors.map(err=>({
                field : err.path[0],
                message :  err.message
            }));
            return res.status(400).json({errors});
        }
        const {username,email,password} = validateData.data;
        //finding user in db
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });
        if(user) return res.status(400).json({msg:"User already exist"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const gender = req.body.gender;

        const newUser = new User({username,email,firstname,lastname,password:hashedPassword,gender});
        await newUser.save();

        //Welcome email
        await sendEmail(
            newUser.email,
            "Welcome, Get ready to conqure the leaderboard with your skills!",
            `Hi ${newUser.username}, welcome to Badminton App!`,
            `<h2>Hi ${newUser.username},</h2>
            <p>Welcome to our  App! Track your matches, ranking, and stats!</p>`
        )

        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(201).json({token,user:{username,email,firstname,lastname}});
        
    }catch(err){
        console.error(err);
        res.status(500).json({ msg: "Server error",err });
    }
}

//Manula login
export const login = async(req,res)=>{
    try{
        const validationData = loginSchema.safeParse(req.body);
        console.log(validationData);
        if(!validationData.success){
            //Sending field specific errror
            console.log(validationData.error);
            const errors = validationData.error.errors.map(err=>({
                field : err.path[0],
                message :  err.message
            }));
            return res.status(400).json({errors});
        }
        console.log(validationData);
        const {identifier,password} = validationData.data;
        const existingUser = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        })
        if(!existingUser) return res.status(400).json({msg:"Invalid credentials"});
        console.log(password,existingUser.password,existingUser);
        const matchingPass =  bcrypt.compare(password,existingUser.password);
        if(!matchingPass) return res.status(400).json({msg:"Invalid credentials"});
        
        const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(201).json({token,existingUser:{identifier}})
    
    }catch(err){
        console.log(`Some error occured ${err}`);
        res.status(500).json({msg:"Server Error"});
    }
}

//Google login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleAuth = async (req,res)=>{
    const { token } = req.body;
    try{
        const ticket = await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const {sub,email,name,picture} = payload;
        //Chekcing if user exist
        const user = await User.findOne({email:email});
        if(!user){
            const newUser = new User({
                googleId:sub,
                email:email,
                imageUrl:picture,
                password:null,
                fromGoogle:true
            })
            await newUser.save();
            return res.status(201).json({
                new:true,
                email,
                userId:newUser._id
            })
        }
        console.log(email,name,picture);
        return res.status(201).json({
            user
        })
    }catch(err){
        console.log(`Some error occured ${err}`);
        return res.status(500).json({mag:"Google Authenicaton failed"});
    }
}

export const completeProfile = async (req, res) => {
  try {
    const { userId, username, firstName, lastName } = req.body;

    //If user exit
    const existingUser = User.findOne({username});
    if(existingUser && existingUser._id.toString() !== userId){
        return res.status(401).json({
            message:"Username Already taken",
            success:false
        })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username, firstName, lastName },
      {new:true}
    );

    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }
    res.json({ success: true, user });

  } catch (err) {
    res.status(500).json({ message: "Failed to complete profile", err });
  }
};
