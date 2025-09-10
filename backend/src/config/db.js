import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
       const connection = await mongoose.connect(process.env.MONGO_URI);
       console.log(`Connected to mongoDB`);
    }
    catch(e){
        console.log(`Couldn't connect to mongoDb ${e}`);
        process.exit(1); //used so that the app doesnt run without connection to mongodb
    }
}

export default connectDB;