const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    otp: String,
otpExpiry: Date,

    // 🔥 NEW (for forgot password)
    resetToken: String,
    resetTokenExpiry: Date
});

module.exports = mongoose.model("User", userSchema);