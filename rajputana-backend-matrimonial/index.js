const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dns = require("dns");

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

const app = express();
const server = http.createServer(app);

// CORS Middleware - dynamically allow any origin and handle preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle CORS preflight request (OPTIONS method)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // agar frontend alag domain par hai
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(
  "/uploads/avatar",
  express.static(
    path.join(__dirname, process.env.UPLOADS_PATH || "uploads/avatar")
  )
);

const io = socketIo(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

const authRoutes = require("./router/authRoutes");
const adminRoutes = require("./router/adminRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/public", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api/v1/admin", adminRoutes);

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});