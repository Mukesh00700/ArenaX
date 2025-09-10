import mongoose, { Schema,model} from "mongoose";

const challengeSchema = new Schema({
    challengeType:{
        type:String,
        enum:["Single","Team"],
        required:true
    },
    challenger:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    opponent:{type:mongoose.Schema.Types.ObjectId, ref:"User"},

    teamChallenger:{type:mongoose.Schema.Types.ObjectId, ref:"Team"},
    teamOpponent:{type:mongoose.Schema.Types.ObjectId, ref:"Team"},

    status:{
        type:String,
        enum:["ACCEPTED","DECLINED","PENDING","CANCELLED"],
        default:"PENDING"
    },
    scheduledAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
})

const Challenge = model("Challenge",challengeSchema);
export default Challenge;
//Sample data
//Single
// {
//   "challengeType": "SINGLE",
//   "challenger": "64fa9c12abc123",
//   "opponent": "64fa9c12abc456",
//   "status": "PENDING",
//   "scheduledAt": "2025-08-30T15:00:00.000Z"
// }
//Team
// {
//   "challengeType": "TEAM",
//   "teamChallenger": "64team123abc",
//   "teamOpponent": "64team456def",
//   "status": "PENDING",
//   "scheduledAt": "2025-08-31T18:00:00.000Z"
// }
