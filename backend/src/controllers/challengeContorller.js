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