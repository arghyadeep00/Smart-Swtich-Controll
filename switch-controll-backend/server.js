import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import switchRouter from "./router/switch.route.js";
import conn from "./config/dbconn.js";
import userRouter from "./router/user.route.js";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
   
    origin: "https://smart-switch-controll-1.onrender.com",
    methods: ["GET", "POST"],
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    
    origin: "https://smart-switch-controll-1.onrender.com",
  })
);
conn();

io.on("connection", (socket) => {});

app.use("/api", switchRouter);
app.use("/api", userRouter);
server.listen(PORT, () => {
  console.log(`App running on port number ${PORT}`);
});
export default io;
