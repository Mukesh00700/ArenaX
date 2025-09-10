import mongoose, { Schema,model} from "mongoose";
import { boolean } from "zod";

const singlesMatchSchema = new Schema({
    type:{type:String,default:"Singles"},
    teamRed:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    teamBlue:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    scheduledAt:{type:Date},
    startedAt:{type:Date},
    isComplete:{type:Boolean,default:false},
    status:{
        type: String,
        enum: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
        default: "SCHEDULED"
    },

    bestOf:{type: Number,enum:[1,3],default:1,required:true},

    result:{
        winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        finishedAt: { type: Date },
        score:{type:String},
        // Array of sets played in this match
        sets: [
            {
                setNumber: { type: Number, required: true }, 
                scores: [
                {
                    player: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                    points: { type: Number, required: true }
                }
            ],
                SetWinner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
        ]
    }

},{timestamps:true});

const doublesMatchSchema = new Schema({
    type:{
        type:String,
        enum:["Men_double","Mix_double"],
        required:true
    },
    teamRed:{type:mongoose.Schema.Types.ObjectId, ref:"Team", required:true},
    teamBlue:{type:mongoose.Schema.Types.ObjectId, ref:"Team", required:true},

    scheduledAt:{type:Date},
    startedAt:{type:Date},
    isComplete:{type:Boolean,default:false},

    status:{
        type: String,
        enum: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
        default: "SCHEDULED"
    },

    bestOf:{type: Number,enum:[1,3],default:1,required:true},

    result:{
        winner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
        finishedAt: { type: Date },

        // Array of sets played in this match
        sets: [
            {
                setNumber: { type: Number, required: true }, 
                scores: [
                {
                    Team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
                    points: { type: Number, required: true }
                }
            ],
                SetWinner: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
        }
        ]
    }

},{timestamps:true});

const SinglesMatch = mongoose.models.SinglesMatch || mongoose.model("SinglesMatch", singlesMatchSchema);
const DoublesMatch = mongoose.models.DoublesMatch || mongoose.model("DoublesMatch", doublesMatchSchema);

export { SinglesMatch, DoublesMatch };



//Sample data
// {
//   "type": "Singles",
//   "player": [
//     { "user": "64a12345abc67890def12301", "team": 1 },
//     { "user": "64a12345abc67890def12302", "team": 2 }
//   ],
//   "scheduledAt": "2025-08-28T15:00:00Z",
//   "startedAt": "2025-08-28T15:15:00Z",
//   "endedAt": "2025-08-28T15:45:00Z",
//   "status": "COMPLETED",
//   "bestOf":3
//   "result": {
//     "winner": "64a12345abc67890def12301",
//     "finishedAt": "2025-08-28T15:45:00Z",
//     "sets": [
//       {
//         "setNumber": 1,
//         "scores": [
//           { "player": "64a12345abc67890def12301", "points": 21 },
//           { "player": "64a12345abc67890def12302", "points": 18 }
//         ],
//         "winner": "64a12345abc67890def12301"
//       },
//       {
//         "setNumber": 2,
//         "scores": [
//           { "player": "64a12345abc67890def12301", "points": 19 },
//           { "player": "64a12345abc67890def12302", "points": 21 }
//         ],
//         "winner": "64a12345abc67890def12302"
//       },
//       {
//         "setNumber": 3,
//         "scores": [
//           { "player": "64a12345abc67890def12301", "points": 21 },
//           { "player": "64a12345abc67890def12302", "points": 16 }
//         ],
//         "winner": "64a12345abc67890def12301"
//       }
//     ]
//   }
// }

