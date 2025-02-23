import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      }
    );
    console.log(`MongoDB Connected || DB Host ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection Error \n`, error);
    throw error;
  }
};
export default connectDB;