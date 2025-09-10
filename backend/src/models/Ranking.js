import mongoose, { Schema,model} from "mongoose";

const rankingSchema = new Schema({
    category:{
        type:String,
        enum:["Single","Men_double","Mix_double"],
        required:true
    },
    team:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"Team",
        required: function(){return this.category !== "Single"; }
    },
    points:{type:Number,default:0},
    rank: { type: Number, default: null },
    lastUpdated: { type: Date, default: Date.now }
},{timestamps:true});

const Ranking = model("Ranking",rankingSchema);
export default Ranking;

//Sample data
// [
//   { "_id": "r1", "category": "single", "player": "u101", "points": 1500, "rank": 1 },
//   { "_id": "r2", "category": "single", "player": "u102", "points": 1400, "rank": 2 },
//   { "_id": "r10", "category": "mixed_double", "team": "t301", "points": 1600, "rank": 1 },
//   { "_id": "r11", "category": "men_double", "team": "t302", "points": 1550, "rank": 1 }
// ]
