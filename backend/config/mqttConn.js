import mqtt from "mqtt";
const options = {
  host: process.env.HOST,
  port: Number(process.env.PORT),
  protocol: process.env.PROTOCOL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};
const mqttServer = mqtt.connect(options);

mqttServer.on("connect", () => {
  console.log("Mqtt server connected");
});

mqttServer.on("error", (err) => {
  console.log("Mqtt server connection failed", err);
});
export default mqttServer;