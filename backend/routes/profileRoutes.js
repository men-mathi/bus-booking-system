const router = require("express").Router();
const Booking = require("../models/Booking");
const mongoose = require("mongoose"); // 🔥 ADD THIS

router.get("/bookings/:userId", async (req, res) => {

    try {

        const userId = req.params.userId;

        // 🔥 FIX: convert to ObjectId
        const bookings = await Booking.find({ 
            userId: new mongoose.Types.ObjectId(userId)
        }).populate("busId");

        res.json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching bookings"
        });

    }

});
// 🔥 CANCEL BOOKING
router.delete("/cancel/:id", async (req, res) => {

    try {

        await Booking.findByIdAndDelete(req.params.id);

        res.json({
            message: "Booking cancelled successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Cancel failed"
        });

    }

});

module.exports = router;