import mqtt from "mqtt";
import switchUser from "../models/user.model.js";

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

export default mqttServer;