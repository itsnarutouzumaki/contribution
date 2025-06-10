import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("MongoDB is connected");
  } catch (err) {
    console.log("MONGO db connection failed !!! ", err);
  }
};

export default connectDB;
