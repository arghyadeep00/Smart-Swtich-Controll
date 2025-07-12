import express from "express";
import {
  login,
  userProfile,
  updateMqtt,
  signUp,
} from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/user/login", login);
userRouter.post("/user/sign_up", signUp);
userRouter.get("/user/profile", authMiddleware, userProfile);
userRouter.put("/user/update-mqtt", authMiddleware, updateMqtt);
export default userRouter;
