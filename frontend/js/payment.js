document.addEventListener("DOMContentLoaded", () => {

    const payBtn = document.querySelector(".payBtn");

    let bookingData = JSON.parse(localStorage.getItem("bookingData"));

    if (!bookingData) {
        alert("Booking data missing");
        window.location.href = "home.html";
        return;
    }

    payBtn.addEventListener("click", completePayment);

    function completePayment() {

        console.log("✅ Payment started");

        payBtn.innerHTML = "Processing...";
        payBtn.disabled = true;

        const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

        if (!bookingData.busId && selectedBus?._id) {
            bookingData.busId = selectedBus._id;
        }

        if (!bookingData.seats || bookingData.seats.length === 0) {
            alert("Seats missing ❌");
            payBtn.innerHTML = "Pay Now";
            payBtn.disabled = false;
            return;
        }

        fetch("https://transitcloud-backend-service-production.onrender.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: bookingData.userId || null,
                busId: bookingData.busId,
                seats: bookingData.seats
            })
        })
        .then(async (res) => {

            let data = {};
            try {
                data = await res.json();
            } catch {}

            console.log("📥 Response:", data);

            const finalTicket = {
                ...bookingData,
                bookingDate: new Date()
            };

            localStorage.setItem("ticketData", JSON.stringify(finalTicket));

            document.querySelector(".paymentCard").innerHTML = `
                <h2 style="text-align:center; color:#4CAF50;">
                    Payment Successful ✅
                </h2>
                <p style="text-align:center;">Redirecting...</p>
            `;

            setTimeout(() => {
                window.location.href = "ticket.html";
            }, 1500);
        })
        .catch(err => {
            console.log(err);
            alert("Payment failed ❌");
            payBtn.innerHTML = "Pay Now";
            payBtn.disabled = false;
        });
    }

});