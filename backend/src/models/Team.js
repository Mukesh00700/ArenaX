import mongoose, { Schema,model} from "mongoose";

const teamSchema = new Schema({
  players: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  type: { type: String, enum: ["Men_double", "Mix_double"], required: true },
  createdAt: { type: Date, default: Date.now },
});
const Team = model("Team",teamSchema);
export default Team;

//Sample data
// [
//   { "_id": "t201", "players": ["u101"], "type": "single" },
//   { "_id": "t202", "players": ["u102"], "type": "single" },
//   { "_id": "t301", "players": ["u103","u104"], "type": "mixed_double" },
//   { "_id": "t302", "players": ["u105","u106"], "type": "men_double" }
// ]
