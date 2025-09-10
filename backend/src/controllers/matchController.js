import { success,safeParse } from "zod";
import { SinglesMatch, DoublesMatch } from "../models/Match.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import  { SinglesMatchSchema,DoublesMatchSchema }  from "../validators/matchValidator.js";


//Match creation Logic
export const SinglesMatchCreationController = async (req,res)=>{
    console.log(req.body);
    try{
        //get data from body
        const validateData = SinglesMatchSchema.safeParse(req.body);
        if(!validateData.success){
            console.log("validation error",validateData.error);
            const errors = validateData.error.errors.map(err=>({
                field : err.path[0],
                message :  err.message
            }));
            return res.status(400).json({errors});
        }
        const {teamRed,teamBlue,bestOf} = validateData.data;

        const newMatch = new SinglesMatch({
            teamRed,
            teamBlue,
            bestOf
        });
        await newMatch.save();
        await User.updateMany(
        { _id: { $in: [teamRed, teamBlue] } },
        { $push: { matchHistory: { matchId: newMatch._id, matchType: "Single" } } }
        );
        res.status(201).json({success:true,newMatch});

    }catch(err){
        console.error(err);
        res.status(500).json({msg:"Server Error"});
    }
    
}

export const DoublesMatchCreationController = async (req,res)=>{
    console.log(req.body);
    try{
        //get data from body
        const validateData = DoublesMatchSchema.safeParse(req.body);
        if(!validateData.success){
            console.log("validation error",validateData.error);
            const errors = validateData.error.errors.map(err=>({
                field : err.path[0],
                message :  err.message
            }));
            return res.status(400).json({errors});
        }
        const {type,teamRed,teamBlue,bestOf} = validateData.data;

        const newMatch = new DoublesMatch({
            type,
            teamRed,
            teamBlue,
            bestOf
        });
        await newMatch.save();
        const allPlayers = [...redTeam.players, ...blueTeam.players];
        await User.updateMany(
            { _id: { $in: allPlayers } },
            { $push: { matchHistory: { matchId: newMatch._id, matchType: type } } }
        );
        res.status(201).json({success:true,newMatch});

    }catch(err){
        console.error(err);
        res.status(500).json({msg:"Server Error"});
    }
    
}

//get match specific details

export const getMatchDetailsController= async(req,res)=>{
    try{
        const match_id = req.params.id;
        console.log(req.params.id);
        console.log(match_id);

        const singleMatch = await SinglesMatch.findById(match_id);
        if(singleMatch) return res.status(401).json(singleMatch);

        const doubleMatch = await DoublesMatch.findById(match_id);
        if(doubleMatch) return res.status(401).json(doubleMatch);

        res.status(401).json({msg:"The match does not exist"});
        
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal server"});
    }
}

//get all matches by type
export const getAllMatchesController = async(req,res)=>{
    try{
        const id = req.user.id;
        const user = User.findById(id);
        if(!user){
            res.status(400).json({msg:"User doesnt exist"});
        }
        const matches = user.matchHistory;
        const type = req.query.type;
        const reqMatches = matches.filetr(m=>{
            m.matchType === type;
        });
        return res.status(200).json({success:true,reqMatches});
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Server error"});
    }
}

//updating matchs
export const addSetResult = async (req,res)=>{
    try{
        const {matchId,matchType} = req.params;
        const {bestOf,setNumber,redScore,blueScore} = req.body;
        const matchModel = matchType === "Singles" ? SinglesMatch : DoublesMatch;

        const match = await matchModel.findById(matchId);
        if(!match) res.status(400).json({msg:"Match does not exist"});
        if(match.status === "COMPLETED") res.status(201).json({msg:"Match has already completed"});

        if(!redScore || !blueScore) return res.status(400).json({msg:"Both players score must be provided"});
        const setWinner = redScore > blueScore ? match.teamRed : match.teamBlue;
        const scores = [{player : teamRed,points:redScore},{player:teamBlue,points:blueScore}];
        match.result.sets.push({
            setNumber,
            scores,
            setWinner
        });
        const redId = teamRed;
        const blueId = teamBlue;
        if(bestOf === 1){
            match.result.winner = setWinner;
            match.status = "COMPLETED";
            match.result.finishedAt = new Date();
        }
        else if(bestOf === 3){
            if(match.result.sets.length === 3){
                const redWins = match.result.sets.filter(
                (s)=>String(s.setWinner) === String(redId)
                )
                const blueWins = match.result.sets.filter(
                    (s)=>String(s.setWinner) === String(blueId)
                )
                match.result.winner = redWins>blueWins?redId:blueId;
                match.result.score = `${redWins}-${blueWins}`;
                match.status = "COMPLETED";
                match.result.finishedAt = new Date();
            }else{
                match.status = "ONGOING";
            }
        }
    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Server Error"});
    }
}
