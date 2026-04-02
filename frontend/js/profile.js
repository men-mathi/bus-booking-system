const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user._id) {
    alert("Session expired. Please login again.");
    localStorage.clear();
    window.location.href = "login.html";
}

document.getElementById("userName").innerText = user.name;
document.getElementById("userEmail").innerText = user.email;
document.getElementById("avatar").innerText = user.name.charAt(0);

async function loadProfile() {

    try {

        const res = await fetch(`http://localhost:5000/api/profile/bookings/${user._id}`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        let totalSeats = 0;
        let totalFare = 0;

        data.forEach(b => {
            totalSeats += b.seats.length;

            const price = b.busId?.price || 500;
            totalFare += price * b.seats.length;
        });

        document.getElementById("totalBookings").innerText = data.length;
        document.getElementById("totalSeats").innerText = totalSeats;
        document.getElementById("totalSpent").innerText = "₹" + totalFare;

        const avgFare = data.length > 0 ? Math.floor(totalFare / data.length) : 0;
        document.getElementById("avgFare").innerText = "₹" + avgFare;

        const container = document.getElementById("bookingList");

        if (data.length === 0) {
            container.innerHTML = "<p>No bookings found</p>";
            return;
        }

        container.innerHTML = "";

        // SORT LATEST FIRST
        data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

        // ===============================
        // 🔥 RECENT BOOKING (WITH TRACK)
        // ===============================
        const recent = data[0];

        container.innerHTML += `
            <h3>🔥 Recent Booking</h3>
            <div class="bookingCard" style="border-left:4px solid #4CAF50;">
                <p><b>${recent.busId?.busName}</b></p>
                <p>${recent.busId?.from} → ${recent.busId?.to}</p>
                <p>Seats: ${recent.seats.join(", ")}</p>

                <!-- ✅ TRACK ONLY HERE -->
                <button onclick='trackBus(${JSON.stringify(recent.busId)})'
                    style="margin-top:10px;background:#36d1dc;border:none;padding:6px 12px;color:white;border-radius:6px;cursor:pointer;">
                    📍 Track Bus
                </button>
            </div>
        `;

        // ===============================
        // 📄 ALL BOOKINGS (NO TRACK)
        // ===============================
        container.innerHTML += `<h3>📄 All Bookings</h3>`;

        data.forEach(b => {
            container.innerHTML += `
                <div class="bookingCard">

                    <p><b>${b.busId?.busName}</b></p>
                    <p>${b.busId?.from} → ${b.busId?.to}</p>
                    <p>Seats: ${b.seats.join(", ")}</p>

                    <div style="margin-top:10px; display:flex; gap:10px;">

                        <!-- ❌ NO TRACK HERE -->
                        <button onclick="cancelBooking('${b._id}')"
                            style="background:red;border:none;padding:6px 10px;color:white;border-radius:6px;cursor:pointer;">
                            Cancel
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (err) {
        console.log(err);
        alert("Failed to load profile");
    }
}

loadProfile();


// ===============================
// ✅ TRACK FUNCTION (KEEP THIS)
// ===============================
function trackBus(bus) {

    console.log("TRACK CLICKED:", bus);

    if (!bus || !bus._id) {
        alert("❌ Bus ID missing");
        return;
    }

    const trackData = {
        busId: bus._id,
        from: bus.from,
        to: bus.to,
        busName: bus.busName
    };

    localStorage.setItem("trackData", JSON.stringify(trackData));

    // OPEN TRACK PAGE
    window.open("track.html", "_blank");

    // OPTIONAL DRIVER VIEW
    window.open(`driver.html?busId=${bus._id}`, "_blank");
}


// ===============================
// ❌ CANCEL BOOKING
// ===============================
async function cancelBooking(id) {

    if (!confirm("Cancel booking?")) return;

    try {
        const res = await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        alert(data.message);
        loadProfile();

    } catch {
        alert("Cancel failed");
    }
}


// ===============================
// 🎨 THEME
// ===============================
function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");

    if (isDark) {
        document.body.style.background = "#0f2027";
        document.body.style.color = "white";
    } else {
        document.body.style.background = "white";
        document.body.style.color = "black";
    }
}


// ===============================
// 🚪 LOGOUT
// ===============================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}