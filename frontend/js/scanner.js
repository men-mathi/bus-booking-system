function onScanSuccess(decodedText) {

    console.log("SCANNED:", decodedText);

    let data;

    try {
        data = JSON.parse(decodedText);
    } catch {
        document.getElementById("result").innerHTML =
            "❌ INVALID QR FORMAT";
        return;
    }

    // 🔥 AUTO VERIFY WITH BACKEND
    fetch("https://transitcloud-backend-service-production.onrender.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ticketId: data.ticketId
        })
    })
    .then(res => res.json())
    .then(result => {

        if (result.valid) {

            document.getElementById("result").innerHTML = `
                <h2 style="color:green;">✅ VALID TICKET</h2>
                <p><b>Ticket:</b> ${data.ticketId}</p>
                <p><b>Bus:</b> ${data.bus}</p>
                <p><b>Route:</b> ${data.from} → ${data.to}</p>
                <p><b>Seats:</b> ${data.seats.join(", ")}</p>
            `;

        } else {

            document.getElementById("result").innerHTML = `
                <h2 style="color:red;">❌ INVALID / USED TICKET</h2>
            `;
        }

    })
    .catch(() => {
        document.getElementById("result").innerHTML =
            "❌ SERVER ERROR";
    });
}


// START CAMERA
const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
    { facingMode: "environment" },
    {
        fps: 10,
        qrbox: 250
    },
    onScanSuccess
);