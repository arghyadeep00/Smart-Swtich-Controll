import mongoose from "mongoose";

const conn = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI);
  if (db) {
    console.log("DB Connected");
  } else {
    console.log("DB Connection faild");
  }
};

export default conn;