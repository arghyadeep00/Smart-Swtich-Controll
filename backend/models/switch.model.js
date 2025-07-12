import mongoose, { Schema } from "mongoose";

const switchSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "switchUser",
  },
  switchId: {
    type: String,
    required: true,
    trim: true,
  },
  switchName: {
    type: String,
    required: true,
    trim: true,
  },
  watt: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Light", "Fan", "Socket"],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const Switch = mongoose.model("Switch", switchSchema);
export default Switch;
