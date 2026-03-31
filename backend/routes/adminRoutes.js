const router = require("express").Router();
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

/* ================= ADMIN LOGIN ================= */
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    // ✅ SAME ADMIN AS YOUR SYSTEM
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

        return res.json({
            token,
            user: adminUser
        });
    }

    return res.status(400).json({
        message: "Invalid admin credentials"
    });
});





/* DASHBOARD */
router.get("/stats", async (req, res) => {
    const users = await User.countDocuments();
    const buses = await Bus.countDocuments();
    const bookings = await Booking.countDocuments();

    res.json({ users, buses, bookings });
});

/* USERS */
router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

/* BOOKINGS */
router.get("/bookings", async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate("busId") // bus details
            .populate({
                path: "userId",
                model: "User",
                select: "name email"
            });

        res.json(bookings);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error loading bookings"
        });
    }

});
/* BUSES */
router.get("/buses", async (req, res) => {
    const buses = await Bus.find();
    res.json(buses);
});

/* ADD BUS */
router.post("/buses", async (req, res) => {
    const bus = await Bus.create(req.body);
    res.json(bus);
});

/* DELETE BUS */
router.delete("/buses/:id", async (req, res) => {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;