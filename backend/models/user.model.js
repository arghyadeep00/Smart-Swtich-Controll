import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    default: 'admin@admin.com',
    trim: true,
  },
  password: {
    type: String,
    default: 'admin',
  },
  phone: {
    type: Number,
  },
  // MQTT Server Fields
  host: {
    type: String,
    trim: true,
  },
  port: {
    type: String,
    trim: true,
  },
  protocol: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  mqtpassword: {
    type: String,
    trim: true,
  },
});

const switchUser = mongoose.model("switchUser", userModel);

export default switchUser;
