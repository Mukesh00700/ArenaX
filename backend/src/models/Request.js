import mongoose, { Schema,model} from "mongoose";

const requestSchema = new Schema({
    from:{type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    to:{type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    type:{
        type:String,
        enum:["Friend","Team_Invite"],
        required:true
    },
    status:{
        type:String,
        enum:["ACCEPTED","PENDING","DECLINED","CANCELLED"],
        default:"PENDING"
    },
    createdAt:{type:Date, default:Date.now},
    respondedAt:{type:Date}
},{timestamps:true});

const Request = model("Request",requestSchema);
export default Request;