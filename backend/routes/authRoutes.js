const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* 🔥 NEW: EMAIL SYSTEM */
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hash = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hash,
            role: "user"
        });

        res.json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email === "admin@gmail.com" && password === "12345") {
            const adminUser = {
                _id: "admin123",
                name: "Admin",
                email: "admin@gmail.com",
                role: "admin"
            };

            const token = jwt.sign(
                { id: adminUser._id, role: "admin" },
                "SECRET123"
            );

            return res.json({ token, user: adminUser });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            "SECRET123"
        );

        res.json({ token, user });

    } catch {
        res.status(500).json({ message: "Login failed" });
    }
});

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("OTP:", otp); // debug

    res.json({ message: "OTP sent" });
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        "SECRET123"
    );

    res.json({ token, user });
});

/* ================= FORGOT PASSWORD (EMAIL LINK) ================= */
router.post("/forgot-password", async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const token = jwt.sign(
            { id: user._id },
            "RESET_SECRET",
            { expiresIn: "15m" }
        );

       const resetLink = `https://transitcloud.netlify.app/reset.html?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Password",
            html: `<h2>Reset Password</h2><a href="${resetLink}">Click here</a>`
        });

        res.json({ message: "Check your email for reset link 📩" });

    } catch {
        res.status(500).json({ message: "Email failed" });
    }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
    try {

        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, "RESET_SECRET");

        const hash = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(decoded.id, { password: hash });

        res.json({ message: "Password reset successful" });

    } catch {
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;