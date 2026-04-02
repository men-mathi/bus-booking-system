const token = localStorage.getItem("token");

// PROTECT
if (!token) {
    window.location.href = "../login.html";
}

// DASHBOARD
async function loadDashboard() {
    const res = await fetch("https://bus-booking-system-94pd.onrender.com/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    document.querySelectorAll(".card p")[0].innerText = data.users;
    document.querySelectorAll(".card p")[1].innerText = data.buses;
    document.querySelectorAll(".card p")[2].innerText = data.bookings;
}

// LOAD BUSES
async function loadAdminBuses() {
    const res = await fetch("https://bus-booking-system-94pd.onrender.com/api/admin/buses", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const table = document.getElementById("busTable");

    table.innerHTML = "";

    data.forEach(b => {
        table.innerHTML += `
        <tr>
            <td>${b.busName}</td>
            <td>${b.from}</td>
            <td>${b.to}</td>
            <td>${b.price}</td>
            <td><button onclick="deleteBus('${b._id}')">Delete</button></td>
        </tr>`;
    });
}

// ADD BUS
async function addBus() {
    const busName = document.getElementById("busName").value;
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const price = document.getElementById("price").value;

    await fetch("https://bus-booking-system-94pd.onrender.com/api/admin/buses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ busName, from, to, price })
    });

    loadAdminBuses();
}

// DELETE BUS
async function deleteBus(id) {
    await fetch(`https://bus-booking-system-94pd.onrender.com/api/admin/buses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    loadAdminBuses();
}

// USERS
async function loadUsers() {
    const res = await fetch("https://bus-booking-system-94pd.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const table = document.getElementById("userTable");

    table.innerHTML = "";

    data.forEach(u => {
        table.innerHTML += `<tr><td>${u.name}</td><td>${u.email}</td></tr>`;
    });
}

// BOOKINGS
async function loadBookings() {
    const res = await fetch("https://bus-booking-system-94pd.onrender.com/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const table = document.getElementById("bookingTable");

    table.innerHTML = "";

    data.forEach(b => {
        table.innerHTML += `
        <tr>
            <td>${b.passengerName}</td>
            <td>${b.busId?.busName}</td>
            <td>${b.seatNumber}</td>
            <td>${b.amount}</td>
        </tr>`;
    });
}

// LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "../login.html";
}