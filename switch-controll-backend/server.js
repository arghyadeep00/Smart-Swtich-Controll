import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
// import WebSocket from "ws";
import switchRouter from "./router/switch.route.js";
import conn from "./config/dbconn.js";
import userRouter from "./router/user.route.js";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
// const io = new WebSocket.Server({ server });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://smart-switch-controll-1.onrender.com",
  })
);
conn();

app.use("/api", switchRouter);
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`App running on port number ${PORT}`);
});
