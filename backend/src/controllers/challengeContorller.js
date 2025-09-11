import { success } from "zod";
import Challenge from "../models/Challenge.js";
import {SinglesMatch,DoublesMatch} from "../models/Match.js";
import Team from "../models/Team.js";
export const challengeCreate = async(req,res)=>{
    try{
        const {challengeType} = req.body;
        const challenger = challengeType === "Single" ? req.body.challenger : req.body.teamChallenger;
        const opponent = challengeType === "Single" ? req.body.opponent : req.body.teamOpponent;
        if(challenger === opponent) return res.status(400).json({msg:"Cant challenge the yourself"});
        const existingChallenge = await Challenge.findOne({challengeType,challenger,opponent});
        if(existingChallenge) res.status(400).json({msg:"Challenge already exist"});

        if(challengeType === "Single"){
            const existingChallenge = await Challenge.findOne({challengeType,challenger,opponent});
            if(existingChallenge) return res.status(400).json({msg:"Challenge already exist"});

            const challenge = new Challenge({
                challengeType,
                challenger,
                opponent,
            });
            await challenge.save();
            return res.status(200).json({success:true,challenge});
        }
        else if(challengeType === "Team"){
            const existingChallenge = await Challenge.findOne({challengeType,teamChallenger:challenger,teamOpponent:opponent});
            if(existingChallenge) return res.status(400).json({msg:"Challenge already exist"});
            const challenge = new Challenge({
                challengeType,
                teamChallenger:challenger,
                teamOpponent:opponent
            })
            await challenge.save();
            return res.status(200).json({success:true,challenge});
        }
        
    }catch(e){
        console.log(e);
        return res.status(500).json({msg:"Server Error"});
    }
}

export const acceptChallenge = async(req,res)=>{
    console.log("hit");
    try{
        const {id} = req.params;
        // console.log(id);
        const challenge = await Challenge.findById(id);
        if(!challenge) return res.status(400).json({msg:"Challenge does not exist"});
        if(challenge.challengeType === "Single"){
            const challenger = challenge.challenger;
            const opponent = challenge.opponent;
            console.log(challenger);
            const newMatch = new SinglesMatch({
                teamRed:challenger,
                teamBlue:opponent
            });
            await newMatch.save();
            challenge.status = "ACCEPTED";
            await challenge.save();
            return res.status(200).json({success:true,newMatch});
        }
        else if(challenge.challengeType === "Team"){
            const challenger = challenge.teamChallenger;
            const opponent = challenge.teamOpponent;
            const existingTeam = await Team.findById(challenger);
            const type = existingTeam.type;
            const newMatch = new DoublesMatch({
                type,
                teamRed:challenger,
                teamBlue:opponent
            });
            await newMatch.save();
            challenge.status = "ACCEPTED";
            await challenge.save();
            return res.status(200).json({success:true,newMatch});
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({msg:"Server Error"});
    }
}

export const rejectChallenge = async(req,res)=>{
    try{
        const {id} = req.params;
        const challenge = await Challenge.findById(id);
        if(!challenge) return res.status(400).json({msg:"Challenge doesn't exist"});
        challenge.status = "DECLINED";
        await challenge.save();
        return res.status(200).json({msg:"Challenge declined"});
    }catch(e){

    }
}


export const allChallengeRecieved = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.query; // "Single" or "Team"

    let challenges = [];

    if (type === "Single") {
      challenges = await Challenge.find({
        challengeType: "Single",
        opponent: userId,
        status: "PENDING"
      })
        .populate("challenger", "username firstname lastname imageUrl")
        .sort({ createdAt: -1 });
    }

    if (type === "Team") {
      const teams = await Team.find({ players: userId }).select("_id");
      const teamIds = teams.map(t => t._id);

      challenges = await Challenge.find({
        challengeType: "Team",
        teamOpponent: { $in: teamIds },
        status: "PENDING"
      })
        .populate("teamChallenger")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ success: true, challenges });

  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Server Error" });
  }
};



export const allChallengeSent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.query; // "Single" or "Team"

    let challenges = [];

    if (type === "Single") {
      challenges = await Challenge.find({
        challengeType: "Single",
        challenger: userId,
        status: "PENDING"
      })
        .populate("opponent", "username firstname lastname imageUrl")
        .sort({ createdAt: -1 });
    } 
    
    if (type === "Team") {
      const teams = await Team.find({ players: userId }).select("_id");
      const teamIds = teams.map(t => t._id);

      challenges = await Challenge.find({
        challengeType: "Team",
        teamChallenger: { $in: teamIds },
        status: "PENDING"
      })
        .populate("teamOpponent")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ success: true, challenges });

  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Server Error" });
  }
};
