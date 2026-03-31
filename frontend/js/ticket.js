// ================================
// GET FINAL DATA
// ================================
const ticketData = JSON.parse(localStorage.getItem("ticketData"));
const user = JSON.parse(localStorage.getItem("user"));

if (!ticketData) {
    alert("Ticket data missing");
    window.location.href = "home.html";
}

// ================================
// GENERATE TICKET ID (ONLY ONCE)
// ================================
if (!ticketData.ticketId) {
    ticketData.ticketId = "TC-" + Math.floor(Math.random() * 100000);
    localStorage.setItem("ticketData", JSON.stringify(ticketData));
}

const ticketId = ticketData.ticketId;

// ================================
// EXTRACT DATA
// ================================
const bus = ticketData.busDetails || {};
const seats = ticketData.seats || [];

// ================================
// DISPLAY DATA
// ================================
document.getElementById("ticketId").innerText = ticketId;
document.getElementById("seatNumber").innerText = seats.join(", ");

document.getElementById("busName").innerText = bus.busName || "Bus";
document.getElementById("from").innerText = bus.from || "-";
document.getElementById("to").innerText = bus.to || "-";

document.getElementById("userName").innerText = user?.name || "User";

// ================================
// DATE & TIME
// ================================
if (ticketData.bookingDate) {

    const d = new Date(ticketData.bookingDate);

    document.getElementById("date").innerText =
        d.toLocaleDateString("en-IN");

    document.getElementById("time").innerText =
        d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

} else {
    document.getElementById("date").innerText = ticketData.date || "-";
    document.getElementById("time").innerText = ticketData.time || "-";
}

// ================================
// QR CODE (MOBILE FRIENDLY)
// ================================

// create simple scan string (NOT JSON)
const qrText = `Ticket:${ticketId} | ${bus.busName} | ${bus.from}→${bus.to} | Seats:${seats.join(",")}`;

// generate QR using image API (BEST FOR MOBILE)
document.getElementById("qrImage").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(qrText);
// ================================
// DOWNLOAD PDF
// ================================
function downloadTicket() {

    const ticketId = document.getElementById("ticketId").innerText;
    const userName = document.getElementById("userName").innerText;
    const busName = document.getElementById("busName").innerText;
    const seats = document.getElementById("seatNumber").innerText;
    const date = document.getElementById("date").innerText;
    const time = document.getElementById("time").innerText;
    const from = document.getElementById("from").innerText;
    const to = document.getElementById("to").innerText;

    const element = document.createElement("div");

    element.innerHTML = `
        <div style="
            width: 600px;
            margin: auto;
            padding: 30px;
            font-family: Arial;
            background: white;
            color: black;
            border-radius: 10px;
        ">
            <h2 style="text-align:center;">TransitCloud Ticket</h2>
            <hr>

            <p><b>Passenger:</b> ${userName}</p>
            <p><b>Bus:</b> ${busName}</p>
            <p><b>Route:</b> ${from} → ${to}</p>
            <p><b>Seats:</b> ${seats}</p>
            <p><b>Date:</b> ${date}</p>
            <p><b>Time:</b> ${time}</p>
            <p><b>Ticket ID:</b> ${ticketId}</p>

            <div style="text-align:center; margin-top:20px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}">
            </div>
        </div>
    `;

    document.body.appendChild(element);

    setTimeout(() => {

        const opt = {
            margin: 0.5,
            filename: 'TransitCloud_Ticket.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            document.body.removeChild(element);
        });

    }, 500);
}