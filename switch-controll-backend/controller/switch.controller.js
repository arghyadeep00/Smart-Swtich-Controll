import Switch from "../models/switch.model.js";
import Activity from "../models/activity.model.js";
import mqtt from "mqtt";
import io from "../server.js"; // Make sure this exports the `io` instance

//  MQTT Connection Options
const options = {
  host: process.env.HOST,
  port: Number(process.env.MQTT_PORT),
  protocol: process.env.PROTOCOL,
  username: process.env.MQTT_USERNAME,
  password: process.env.PASSWORD,
};

const mqttServer = mqtt.connect(options);

let status = "disconnected";

mqttServer.on("connect", () => {
  mqttServer.subscribe("device/status", (err) => {
    if (err) {
      console.error("Failed to subscribe to topic:", err.message);
    } else {
      console.log("MQTT connected and subscribed to device/status");
    }
  });
});

mqttServer.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

mqttServer.on("message", (topic, message) => {
  if (topic === "device/status") {
    status = message.toString();
    console.log("Received status from device:", status);
    io.emit("deviceStatus", status);
  }
});

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

    try {
      const sw = await Switch.findOne({ switchId: id });

      if (newValue === true) {
        await Activity.create({
          userId: req.user._id,
          switchId: id,
          switchName: sw?.switchName || "",
          watt: sw?.watt || "",
          category: sw?.category || "",
          onTime: Date.now(),
          offTime: null,
        });
      } else {
        await Activity.findOneAndUpdate(
          { switchId: id, offTime: null },
          { offTime: Date.now() },
          { sort: { onTime: -1 } }
        );
      }

      await Switch.findOneAndUpdate({ switchId: id }, { isActive: newValue });

      res.status(200).json({
        success: true,
        message: "Published to MQTT",
      });
    } catch (error) {
      console.error("Switch control error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });
};

// device off time all switch data change to (off)
const allSwitchOff = async (req, res) => {
  try {
    // Set all switches to off
    await Switch.updateMany({}, { isActive: false });
    await Activity.updateMany({ offTime: null }, { offTime: Date.now() });

    res.json({
      success: true,
      message: "All switches turned off and activities updated",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to turn off switches" });
  }
};
// Get Daily Activity
const getMyActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = new Date(req.params.date);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      userId,
      onTime: { $gte: start, $lte: end },
    }).sort({ onTime: -1 });

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

// ✅ Add a New Switch
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
    console.error("Add switch error:", error);
    res.status(500).json({
      success: false,
      message: "Unauthorized or server error",
    });
  }
};

// ✅ Get Switches for a User
const getSwitch = async (req, res) => {
  const userID = req.user._id;

  try {
    const response = await Switch.find({ userId: userID }).sort({
      switchId: 1,
    });

    res.status(200).json({
      success: true,
      message: "Fetched all switch items",
      response,
    });
  } catch (error) {
    console.error("Get switches error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid user authentication",
    });
  }
};

// ✅ Edit Switch
const editSwitch = async (req, res) => {
  const { category, switchId, switchName, watt } = req.body;

  try {
    await Switch.findOneAndUpdate({ switchId }, { switchName, watt, category });

    res.status(200).json({
      success: true,
      message: "Update successful",
    });
  } catch (error) {
    console.error("Edit switch error:", error);
    res.status(400).json({
      success: false,
      message: "Update failed",
    });
  }
};

// ✅ Delete Switch
const deleteSwitch = async (req, res) => {
  const id = req.params.id;

  try {
    await Switch.findOneAndDelete({ switchId: id });

    res.status(200).json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    console.error("Delete switch error:", error);
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
  allSwitchOff,
};
