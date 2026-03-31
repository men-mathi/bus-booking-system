const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    // ✅ FIXED (ObjectId reference to User)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // ✅ Already correct
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus"
    },

    seats: [Number],

    bookingDate: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model("Booking", bookingSchema);