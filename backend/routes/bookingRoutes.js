const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const Booking = require("../models/Booking"); // ❗ ADD THIS
/* Book seats */

router.post("/book", bookingController.bookSeat);

/* Get booked seats */

router.get("/seats/:busId", bookingController.getBookedSeats);

/* ================= USER BOOKINGS ================= */
router.get("/user/:userId", async (req, res) => {

    try {

        const bookings = await Booking.find({ userId: req.params.userId })
            .populate("busId");

        res.json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching user bookings"
        });

    }

});


router.post("/verify", async (req, res) => {

    try {

        const { ticketId } = req.body;

        if (!ticketId) {
            return res.json({ valid: false });
        }

        // 🔥 simple validation (you can improve later)
        if (ticketId.startsWith("TC-")) {
            return res.json({ valid: true });
        }

        res.json({ valid: false });

    } catch {
        res.json({ valid: false });
    }
});

module.exports = router;