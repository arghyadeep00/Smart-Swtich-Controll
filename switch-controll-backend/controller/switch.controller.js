import Switch from "../models/switch.model.js";
import Activity from "../models/activity.model.js";
import mqtt from "mqtt";
import switchUser from "../models/user.model.js";
import "dotenv/config";

const options = {
  host: "16e43abbd885424baf2d25eba3b63656.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "hivemq.webclient.1747369072656",
  password: "pxCnV76@a*$P9m.K3GLo",
};

const mqttServer = mqtt.connect(options);

mqttServer.on("connect", () => {
  console.log("Mqtt server connected");
});

mqttServer.on("error", (err) => {
  console.log("Mqtt server connection failed", err);
});

// Switch Control (on/off)
const switchControl = async (req, res) => {
  const { id, newValue } = req.body;

  if (!id || typeof newValue === "undefined") {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  mqttServer.publish(id, newValue.toString(), async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "MQTT publish error" });
    }

    const sw = await Switch.findOne({ switchId: id });

    if (newValue === true) {
      await Activity.create({
        userId: req.user._id,
        switchId: id,
        switchName: sw ? sw.switchName : "",
        watt: sw ? sw.watt : "",
        category: sw ? sw.category : "",
        onTime: Date.now(),
        offTime: null,
      });
    } else {
      await Activity.findOneAndUpdate(
        { switchId: id, offTime: null },
        { offTime: Date.now() }
      );
    }

    await Switch.findOneAndUpdate({ switchId: id }, { isActive: newValue });

    res.status(200).json({
      success: true,
      message: "Published to MQTT",
    });
  });
};

// Get all activities for the logged-in user
const getMyActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = new Date(req.params.date);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    const activities = await Activity.find({
      userId,
      onTime: { $gte: start, $lte: end },
    }).sort({ onTime: -1 });
    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

// Add a new switch
const addSwitch = async (req, res) => {
  const { id, name, watt, category } = req.body;

  if (!id || !name || !watt || !category) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields",
    });
  }

  try {
    const exists = await Switch.findOne({ switchId: id });
    if (exists) {
      return res.status(406).json({
        success: false,
        message: "Please change the switch id",
      });
    }
    await Switch.create({
      userId: req.user._id,
      switchId: id,
      switchName: name,
      watt,
      category,
    });
    res.status(200).json({
      success: true,
      message: "Switch added",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
};

// Get all switches for the logged-in user
const getSwitch = async (req, res) => {
  const userID = req.user._id;
  try {
    const response = await Switch.find({ userId: userID }).sort({
      switchId: 1,
    });
    res.status(200).json({
      success: true,
      message: "fetch all switch items",
      response,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "invalid user authentication",
    });
  }
};

// Edit a switch
const editSwitch = async (req, res) => {
  const { category, switchId, switchName, watt } = req.body;
  try {
    await Switch.findOneAndUpdate(
      { switchId },
      {
        switchName,
        watt,
        category,
      }
    );
    res.status(200).json({
      success: true,
      message: "Update successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Update failed",
    });
  }
};

// Delete a switch
const deleteSwitch = async (req, res) => {
  const id = req.params.id;
  try {
    await Switch.findOneAndDelete({ switchId: id });
    res.status(200).json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error can't delete",
    });
  }
};

export {
  addSwitch,
  getSwitch,
  switchControl,
  editSwitch,
  deleteSwitch,
  getMyActivity,
};
