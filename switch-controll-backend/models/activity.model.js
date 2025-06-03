import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "switchUser",
    required: true,
  },
  switchId: {
    type: String,
    required: true,
  },
  switchName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Light", "Fan", "Socket"],
    required: true,
  },
  watt:{
    type:Number,
    required:true
  },
  onTime: {
    type: Date,
    
  },
  offTime: {
    type: Date,
  },
  duration: {
    type: String, 
  },
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
