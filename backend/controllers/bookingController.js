const Booking = require("../models/Booking");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Bus = require("../models/Bus");

/* ================================
   📧 EMAIL FUNCTION
================================ */
async function sendEmail(user, bus, seats) {

    const nodemailer = require("nodemailer");
    const pdf = require("html-pdf");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "menmathianandh6@gmail.com",
            pass: "jvxj rsim qepc kart"
        }
    });

    // 🔥 CREATE TICKET HTML (LIKE REAL TICKET)
   const ticketHTML = `
<!DOCTYPE html>
<html>
<head>
<style>
body {
    font-family: Arial, sans-serif;
    background: #f4f4f4;
    padding: 20px;
}

.ticket {
    width: 600px;
    margin: auto;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* HEADER */
.ticket-header {
    background: linear-gradient(135deg, #36d1dc, #5b86e5);
    color: white;
    padding: 20px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
}

/* BODY */
.ticket-body {
    padding: 20px;
}

.row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-size: 16px;
}

.label {
    font-weight: bold;
    color: #555;
}

.value {
    color: #222;
}

/* DIVIDER */
.divider {
    border-top: 1px dashed #ccc;
    margin: 15px 0;
}

/* FOOTER */
.ticket-footer {
    text-align: center;
    padding: 15px;
    font-size: 14px;
    background: #fafafa;
    color: #666;
}
</style>
</head>

<body>

<div class="ticket">

    <div class="ticket-header">
        🎫 TransitCloud Ticket
    </div>

    <div class="ticket-body">

        <div class="row">
            <span class="label">Passenger</span>
            <span class="value">${user.name}</span>
        </div>

        <div class="row">
            <span class="label">Bus</span>
            <span class="value">${bus.busName}</span>
        </div>

        <div class="row">
            <span class="label">Route</span>
            <span class="value">${bus.from} → ${bus.to}</span>
        </div>

        <div class="divider"></div>

        <div class="row">
            <span class="label">Seats</span>
            <span class="value">${seats.join(", ")}</span>
        </div>

        <div class="row">
            <span class="label">Date</span>
            <span class="value">${new Date().toLocaleDateString()}</span>
        </div>

        <div class="row">
            <span class="label">Time</span>
            <span class="value">${new Date().toLocaleTimeString()}</span>
        </div>

    </div>

    <div class="ticket-footer">
        Thank you for booking with TransitCloud 🚍
    </div>

</div>

</body>
</html>
`;

    // 🔥 UNIQUE FILE NAME (IMPORTANT)
    const fileName = `tickets/ticket_${Date.now()}.pdf`;
    // 🔥 CREATE PDF
    await new Promise((resolve, reject) => {
        pdf.create(ticketHTML).toFile(fileName, function (err, res) {
            if (err) reject(err);
            else resolve(res);
        });
    });

    // 🔥 SEND EMAIL WITH PDF
    const mailOptions = {
        from: "TransitCloud",
        to: user.email,
        subject: "🎫 Booking Confirmation",

        html: `
            <h2>Booking Confirmed ✅</h2>
            <p>Your ticket is attached below 📎</p>
        `,

        attachments: [
            {
                filename: "TransitCloud_Ticket.pdf",
                path: fileName
            }
        ]
    };

    await transporter.sendMail(mailOptions);
}


/* ================================
   BOOK SEATS
================================ */
exports.bookSeat = async (req, res) => {

    try {

        console.log("Incoming booking:", req.body);

        const { userId, busId, seats } = req.body;

        // ✅ VALIDATION (VERY IMPORTANT)
        if (!busId || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({
                message: "Invalid booking data"
            });
        }

        // 🔥 FIX: avoid null user crash
        if (!userId) {
            console.log("⚠️ Guest booking (no userId)");
        }

        // Step 1: Get already booked seats
        const bookings = await Booking.find({ busId });

        let bookedSeats = [];

        bookings.forEach(b => {
            bookedSeats = bookedSeats.concat(b.seats);
        });

        // Step 2: Check conflict
        const conflict = seats.some(seat => bookedSeats.includes(seat));

        if (conflict) {
            return res.status(400).json({
                message: "Some seats already booked"
            });
        }

        // Step 3: Save booking
        const booking = new Booking({
            userId: userId || null,
            busId,
            seats
        });

        await booking.save();

        // 🔥 SAFE EMAIL (NO CRASH EVER)
        try {
            if (userId) {
                const user = await User.findById(userId);
                const bus = await Bus.findById(busId);

                if (user && bus) {
                    await sendEmail(user, bus, seats);
                }
            }
        } catch (e) {
            console.log("Email skipped:", e.message);
        }

        // 🔥 SOCKET
        const io = req.app.get("io");

        if (io) {
            io.emit("seatBooked", { busId, seats });
        }

        res.json({
            message: "Seat Booked Successfully",
            bookingDate: booking.bookingDate
        });

    } catch (error) {

        console.log("🔥 BOOKING ERROR:", error);

        res.status(500).json({
            message: "Booking failed"
        });
    }
};

/* ================================
   GET BOOKED SEATS
================================ */

exports.getBookedSeats = async (req, res) => {

    try {

        const busId = req.params.busId;

        const bookings = await Booking.find({ busId });

        let bookedSeats = [];

        bookings.forEach(booking => {
            bookedSeats = bookedSeats.concat(booking.seats);
        });

        res.json(bookedSeats);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching booked seats"
        });

    }

};