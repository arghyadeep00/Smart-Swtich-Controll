import express from "express";
import {
  addSwitch,
  deleteSwitch,
  editSwitch,
  getMyActivity,
  getSwitch,
  switchControl,
  allSwitchOff,
} from "../controller/switch.controller.js";
import authMiddleware from "../middleware/auth.js";

const switchRouter = express.Router();

switchRouter.post("/switch/switch-control", authMiddleware, switchControl);
switchRouter.post("/switch/add-switches", authMiddleware, addSwitch);
switchRouter.get("/switch/get-switches", authMiddleware, getSwitch);
switchRouter.put("/switch/edit-switch", authMiddleware, editSwitch);
switchRouter.delete("/switch/delete-switch/:id", authMiddleware, deleteSwitch);
switchRouter.get("/switch/my-activity/:date", authMiddleware, getMyActivity);
switchRouter.post("/switch/all-off", authMiddleware, allSwitchOff);
export default switchRouter;
