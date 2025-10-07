import mongoose, { Schema,model} from "mongoose";

const userSchema = new mongoose.Schema({

    firstname:{type:String},
    lastname:{type:String},
    username:{type:String,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    gender:{type:String,enum:["male","female","other"]},
    googleId:{type:String},
    totalWin:{type:Number,default:0},
    totalLoss:{type:Number,default:0},
    imageUrl: {type:String},
    completeProfile:{type:Boolean,default:false},

    //if signing using google
    fromGoogle:{type:Boolean,default:false},
    stats:{
        singles:{
            win:{type:Number,default:0},
            loss:{type:Number,default:0},
            rank:{type:Number,default:0}
        },
        doubles:{
            win:{type:Number,default:0},
            loss:{type:Number,default:0},
            rank:{type:Number,default:0}
        },
        mix_doubles:{
            win:{type:Number,default:0},
            loss:{type:Number,default:0},
            rank:{type:Number,default:0}
        }
    },

    friends:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    matchHistory: [
    {
        matchId: { type: mongoose.Schema.Types.ObjectId, ref:"Match" },
        matchType: { type: String, enum: ["Single", "Men_double","Mix_double"] }
    }
    ]

},{timestamps:true});

const User = model("User", userSchema);
export default User;




//Sample data
// {
//   "_id": "u101",
//   "firstname": "Alice",
//   "lastname": "Smith",
//   "username": "alice_s",
//   "email": "alice@example.com",
//   "password": "hashed_password_here",
//   "gender": "female",
//   "googleId": "google-oauth-id-123",
//   "fromGoogle": true,
//   "totalWin": 15,
//   "totalLoss": 5,
//   "stats": {
//     "singles": {
//       "win": 10,
//       "loss": 2,
//       "rank": 1
//     },
//     "doubles": {
//       "win": 3,
//       "loss": 2,
//       "rank": 5
//     },
//     "mix_doubles": {
//       "win": 2,
//       "loss": 1,
//       "rank": 3
//     }
//   },
//   "matchHistory": [
//     { "matchId": "m501" },
//     { "matchId": "m502" },
//     { "matchId": "m503" }
//   ],
//   "createdAt": "2025-08-26T10:00:00Z",
//   "updatedAt": "2025-08-26T15:00:00Z"
// }
