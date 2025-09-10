import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    //
    from:{
        kind:{type:String,enum:["User","Team"],requeired:true},
        item: { type: mongoose.Schema.Types.ObjectId, refPath: "from.kind", required: true }
    },
    //a single notification can be for mulitiple user
    to: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    type: {
        type: String,
        enum: [
        "FRIEND_REQUEST",
        "TEAM_INVITE",
        "TEAM_CHALLENGE",
        "MATCH_INVITE",
        "GENERAL"
        ],
        required: true
    },
    message: { type: String },
     status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED", "READ"],
        default: "PENDING"
    },
    isRead: {
        type: Boolean,
        default: false,
    },
  createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = model("Notification",notificationSchema);
export default Notification;

