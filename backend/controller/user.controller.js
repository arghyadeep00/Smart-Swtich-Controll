import switchUser from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await switchUser.findOne({ email });
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const hashPassword = await bcrypt.compare(password, data.password);
    if (hashPassword) {
      const token = jwt.sign(
        { _id: data._id, email: data.email, name: data.name },
        process.env.JWT_TOKEN
      );
      res.status(200).json({
        success: true,
        message: "login success",
        token: token,
        userName: data.name,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid user",
    });
  }
};
const signUp = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: true,
      message: "Please fill all the field",
    });
  }
  try {
    const checkUser = await switchUser.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "exist",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const data = await switchUser.insertOne({
      name,
      email,
      phone,
      password: hashPassword,
    });
    if (data) {
      res.status(200).json({
        success: true,
        message: "User registration success",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Server error data not save",
    });
  }
};
const userProfile = async (req, res) => {
  try {
    const response = await switchUser.findById(req.user._id);
    res.status(200).json({
      success: true,
      userProfile: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateMqtt = async (req, res) => {
  const { host, port, protocol, username, mqtpassword } = req.body;
  try {
    const response = await switchUser.findByIdAndUpdate(
      req.user._id,
      {
        host,
        port,
        protocol,
        username,
        mqtpassword,
      },
      {
        new: true,
      }
    );
    if (response) {
      res.status(200).json({
        success: true,
        message: "mqtt details update",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "mqtt details update error",
    });
    console.log(error);
  }
};

export { login, signUp, userProfile, updateMqtt };
