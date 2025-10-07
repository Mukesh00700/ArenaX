import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import auth from "./src/routes/auth.js";
import match from './src/routes/match.js';
import request from "./src/routes/request.js";
import challenge from "./src/routes/challenge.js"
import profileRoutes from "./src/routes/porfileRoutes.js"
dotenv.config();
const app = express();
connectDB();
app.use(express.json());
app.use(cors());
const PORT = Number(process.env.PORT) || 3000;


try{
  console.log(`connection to /auth`);
  app.use("/auth",auth);
}catch(err){
  console.log(`Some error occoured ${err}`);
}

try{
  console.log(`connection to /match`);
  app.use("/match",match);

}catch(err){
  console.log(`Some error occoured ${err}`);
}

try{
  console.log(`connection to /request`);
  app.use("/request",request);

}catch(err){
  console.log(`Some error occoured ${err}`);
}

try{
  console.log(`connection to /challenge`);
  app.use("/challenge",challenge);

}catch(err){
  console.log(`Some error occoured ${err}`);
}

try{
  console.log(`connection to /profile`);
  app.use("/profile",profileRoutes);
}catch(err){
  console.log(`Some error occoured ${err}`);
}



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
