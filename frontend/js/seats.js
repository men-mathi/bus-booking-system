const socket = io("https://bus-booking-system-94pd.onrender.com"); // 🔥 NEW

const seatContainer = document.getElementById("seatContainer");
const confirmBtn = document.getElementById("confirmBtn");

const bus = JSON.parse(localStorage.getItem("selectedBus"));

let selectedSeats = [];
let bookedSeats = [];

// ================================
// 🔒 SEAT LOCK (NEW - SAFE ADD)
// ================================
let lockedSeats = JSON.parse(localStorage.getItem("lockedSeats")) || [];

// remove expired locks
lockedSeats = lockedSeats.filter(lock => Date.now() < lock.expiry);
localStorage.setItem("lockedSeats", JSON.stringify(lockedSeats));

/* CHECK BUS */
if (!bus) {
    alert("Bus information missing");
    window.location.href = "buses.html";
}

/* LOAD BOOKED SEATS */
async function loadBookedSeats() {
    try {
        const res = await fetch(`https://bus-booking-system-94pd.onrender.com/api/bookings/seats/${bus._id}`);
        bookedSeats = await res.json();

        generateSeats();

    } catch (err) {
        console.log(err);
        generateSeats();
    }
}

/* GENERATE SEATS */
function generateSeats() {

    seatContainer.innerHTML = "";

    for (let i = 1; i <= 40; i++) {

        const seat = document.createElement("div");

        seat.classList.add("seat");
        seat.innerText = i;

        // 🔴 already booked
        if (bookedSeats.includes(i)) {
            seat.classList.add("booked");
        }

        // 🔒 locked seats (NEW)
        const isLocked = lockedSeats.some(l => l.seat === i);
        if (isLocked) {
            seat.classList.add("booked");
        }

        seat.addEventListener("click", function () {

            if (seat.classList.contains("booked")) return;

            // 🔒 CHECK LOCK (NEW)
            const locked = lockedSeats.some(l => l.seat === i);
            if (locked) {
                alert("Seat temporarily locked ❌");
                return;
            }

            if (selectedSeats.includes(i)) {

                selectedSeats = selectedSeats.filter(s => s !== i);
                seat.classList.remove("selected");

                // 🔓 remove lock (NEW)
                lockedSeats = lockedSeats.filter(l => l.seat !== i);
                localStorage.setItem("lockedSeats", JSON.stringify(lockedSeats));

            } else {

                selectedSeats.push(i);
                seat.classList.add("selected");

                // 🔥 LOCK FOR 2 MINUTES (NEW)
                lockedSeats.push({
                    seat: i,
                    expiry: Date.now() + (2 * 60 * 1000)
                });

                localStorage.setItem("lockedSeats", JSON.stringify(lockedSeats));
            }

        });

        seatContainer.appendChild(seat);
    }
}

/* CONFIRM BOOKING */
confirmBtn.addEventListener("click", function () {

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat");
        return;
    }

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {}

    localStorage.removeItem("bookingData");
    localStorage.removeItem("ticketData");

    const bookingData = {
        userId: user ? user._id : null,
        busId: bus._id,
        seats: selectedSeats,
        date: bus.date,
        time: bus.time,
        busDetails: bus
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    // 🔥 LOCK SEATS UI (existing)
    selectedSeats.forEach(seatNum => {
        const allSeats = document.querySelectorAll(".seat");
        allSeats.forEach(seat => {
            if (parseInt(seat.innerText) === seatNum) {
                seat.classList.add("booked");
                seat.classList.remove("selected");
            }
        });
    });

    window.location.href = "payment.html";
});

/* 🔥 REAL-TIME LISTENER */
socket.on("seatBooked", (data) => {

    if (data.busId !== bus._id) return;

    data.seats.forEach(seatNum => {

        const allSeats = document.querySelectorAll(".seat");

        allSeats.forEach(seat => {

            if (parseInt(seat.innerText) === seatNum) {
                seat.classList.add("booked");
                seat.classList.remove("selected");
            }

        });

    });
});

/* START */
loadBookedSeats();