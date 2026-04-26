const { Client: AdsClient } = require("ads-client");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// ROUTES
const authRoute = require("./src/routes/auth");
const CncData = require("./src/models/data");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===================== HTTP + SOCKET =====================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ===================== AUTH SOCKET MIDDLEWARE =====================
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// ===================== ROUTES =====================
app.use("/auth", authRoute);

// ===================== MONGODB =====================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ===================== PLC CLIENT =====================
const plcClient = new AdsClient({
  targetAmsNetId: "172.20.254.67.1.1",
  targetAdsPort: 851,
});

// ===================== PLC STATE =====================

let plcState = {
  connected: false,
  axes: {
    x: { value: 0, jog: { plus: false, minus: false } },
    y: { value: 0, jog: { plus: false, minus: false } },
    z: { value: 0, jog: { plus: false, minus: false } },
  },
  mode: { manual: false, auto: false },
  nc: { Enable: false, start: false, stop: false, reset: false, isSingleMode: false, triggerNext: false },
  btn: { createGroup: false, deleteGroup: false, inching: false, moveToPos: false, loadProgram: false, setMode: false },
  targetPos: { x: 0, y: 0, z: 0 },
  NCfile: "",
  feedRate: 100,

};

// ===================== SOCKET =====================
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("updatePLC", async (payload) => {
    const { path, value, plcVariable } = payload;
    console.log("Variable: ", plcVariable, " Value: ", value)

    if (plcVariable) {
      try {
        const res = await plcClient.writeValue(plcVariable, value);
        console.log(res)
      } catch (err) {
        console.error(err);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// ===================== CONNECT PLC =====================
const connectPLC = async () => {
  console.log("Connecting to PLC...");
  try {
    if (plcClient.connected) {
      await plcClient.disconnect();
    }

    await plcClient.connect();
    plcState.connected = true;
    console.log("✅ PLC Connected");

    await Promise.all([
      plcClient.subscribeValue("Main.xPos", (data) => {
        plcState.axes.x.value = Number(data.value);
        console.log("X:", data.value);
      }),
      plcClient.subscribeValue("Main.yPos", (data) => {
        plcState.axes.y.value = Number(data.value);
        console.log("Y:", data.value);
      }),
      plcClient.subscribeValue("Main.zPos", (data) => {
        plcState.axes.z.value = Number(data.value);
        console.log("Z:", data.value);
      })
    ]);

    console.log("🚀 All axes subscribed");

  } catch (err) {
    plcState.connected = false;
    console.error("❌ PLC Error:", err.message);
    setTimeout(connectPLC, 5000);
  }
};

connectPLC();

setInterval(() => {
  io.emit("plcState", plcState);
}, 20);
// ===================== SAVE TO DATABASE (SNAPSHOT) =====================
setInterval(async () => {
  plcState.timestamp = new Date();

  io.emit("plcState", plcState);

  try {
    await CncData.create({
      position: {
        x: plcState.axes.x.value,
        y: plcState.axes.y.value,
        z: plcState.axes.z.value
      },
      state: "RUN",
      timestamp: new Date()
    });
  } catch (err) {
    console.error("DB error:", err.message);
  }

}, 5000);

server.listen(8080, () => {
  console.log("Server running on port 8080");
});