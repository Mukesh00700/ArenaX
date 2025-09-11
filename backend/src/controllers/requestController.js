import { success } from "zod";
import Request from "../models/Request.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import {requestSchema} from "../validators/requestValidator.js"

export const createRequest = async(req,res)=>{
    console.log(req.body);
    try{
        const validateData = requestSchema.safeParse(req.body);
        if(!validateData.success){
                console.log("validation error",validateData.error);
                const errors = validateData.error.errors.map(err=>({
                field : err.path[0],
                message :  err.message
                }));
                return res.status(400).json({errors});
        }
        const {from,to,type} = validateData.data;
        //preventing selfrequest
        if(from === to) return res.status(400).json("Make Friends with other you intovert, cant send request to yourself");

        //existing request
        const existingRequest = await Request.findOne({from,to,type,status:"PENDING"});
        if(existingRequest) return res.status(400).json({msg:"Request already exist"});
        if(type === "Friend"){
            await Request.create({from,to,type});
            return res.status(200).json({msg:"Friend request sent successfully"});
        }else if(type === "Team_Invite"){
            const existingTeam = await Team.findOne({players:[from,to]});
            if(existingTeam) return res.status(400).json({msg:"Team already exist"});
            await Request.create({from,to,type});
            return res.status(200).json({msg:"Team requst sent seccessfully"})
        }
    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Server Error"});
    }
}

export const acceptRequest = async(req,res)=>{
    try{
        const { id } = req.params;
        const request = await Request.findById(id);
        if(!request) return res.status(400).json({msg:"Request doesnt exist"});
        console.log(request.type);
        if(request.type === "Friend"){
            const toUser = await User.findById(request.to.toString());
            const fromUser = await User.findById(request.from.toString());
             if (!toUser || !fromUser) {
                return res.status(400).json({ msg: "User not found" });
            }
            console.log(toUser.friends)
            if (!toUser.friends.includes(fromUser._id)) {
                toUser.friends.push(fromUser._id);
                await toUser.save();
            }
            console.log(fromUser.friends);
            if (!fromUser.friends.includes(toUser._id)) {
                fromUser.friends.push(toUser._id);
                await fromUser.save();
            }
        }
        else if(request.type === "Team_Invite"){
            const toUser = await User.findById(request.to.toString());
            const fromUser = await User.findById(request.from.toString());
            if (!toUser || !fromUser) {
                console.log("User(s) not found");
                return res.status(400).json({ msg: "One or both users not found" });
            }
            const existTeam = Team.findOne({players:[toUser._id,fromUser._id]});
            if(existTeam) return res.status(400).json({msg:"Team Already exist"});
            if(toUser.gender === "male" && fromUser.gender === "male"){
                await Team.create({
                    players:[toUser._id,fromUser._id],
                    type:"Doubles"
                });
            }
            else{
                await Team.create({
                    players:[toUser._id,fromUser._id],
                    type:"Mix_doubles"
                });
            }
        }
        request.status = "ACCEPTED";
        request.respondedAt = new Date();
        await request.save();

        return res.status(200).json({ success: true, msg: "Request accepted" });

    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Server Error"});
    }
}

export const rejectRequest = async(req,res)=>{
    try{
        const { id } = req.params;
        const request = await Request.findById(id);
        if(!request) return res.status(400).json({msg:"This request does not exist"});
        request.status = "DECLINED";
        request.respondedAt = new Date();
        await request.save();
        return res.status(200).json({success:true,msg:"Request declined"});
    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Server Error"});
    }
}

export const allRequestRecieved = async(req,res)=>{
    const userId = req.user._id;
    try{
        const requests = await Request.find({ 
        to: userId, 
        status: "PENDING" // only showing pending requests
        })
        .populate("from", "username firstname lastname imageUrl") // show who sent it
        .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, requests });

    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Server Error"});
    }
}

export const allRequestSent = async(req,res)=>{
    const userId = req.user._id;
    console.log(userId);
    try{
        const requests = await Request.find({
            from:userId,
            status:"PENDING"
        })
        .populate("to","username firstname lastname imageUrl")
        .sort({createdAt : -1});
        
        return res.status(200).json({success:true,requests});
    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Server Error"});
    }
}