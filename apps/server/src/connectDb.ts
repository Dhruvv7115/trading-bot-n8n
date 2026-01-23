import mongoose from "mongoose"
import { MONGO_URI } from "./constant"

export const connectToMongoDB = async() => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URI,);
    if(!connectionInstance){
      console.log("Something went wrong while connecting to MongoDB.");
    }
    console.log("Connected to MongoDB successfully! " + "HOST: " + connectionInstance.connection.host);
  } catch (error) {
    console.log("Something went wrong while connecting to MongoDB.");
    process.exit(1);
  }
}