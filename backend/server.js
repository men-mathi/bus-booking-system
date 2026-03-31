const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

app.get("/", (req,res)=>{
    res.send("Backend running successfully");
});

/* SOCKET */
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

/* ✅ FIX */
app.set("io", io);

io.on("connection", (socket) => {
    console.log("🔥 Client connected:", socket.id);

    socket.on("sendLocation", (data) => {
        console.log("📡 Location:", data);
        io.emit("busLocation", data);
    });
});

/* Start */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});