// ================================
// DEBUG
// ================================
console.log("TRACK PAGE LOADED");

// ================================
// GET BUS DATA
// ================================
const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

console.log("SELECTED BUS:", selectedBus);

if (!selectedBus) {
    alert("No bus selected ❌");
    window.location.href = "buses.html";
}

// ================================
// BUS DATA
// ================================
const fromCity = selectedBus.from;
const toCity = selectedBus.to;

document.getElementById("routeText").innerText =
    `${fromCity} → ${toCity}`;

document.getElementById("busName").innerText =
    selectedBus.busName;

// ================================
// CITY COORDS
// ================================
const cityCoords = {
    "Chennai": [13.0827, 80.2707],
    "Madurai": [9.9252, 78.1198],
    "Vellore": [12.9165, 79.1325],
    "Kanyakumari": [8.0883, 77.5385],
    "Trichy": [10.7905, 78.7047],
    "Coimbatore": [11.0168, 76.9558],
    "Salem": [11.6643, 78.1460],
    "Erode": [11.3410, 77.7172],
    "Bangalore": [12.9716, 77.5946],
    "Pondicherry": [11.9416, 79.8083],
     "Tirunelveli": [8.7139, 77.7567]
};

const start = cityCoords[fromCity];
const end = cityCoords[toCity];

if (!start || !end) {
    alert("City coordinates missing ❌");
    console.log("Missing city:", fromCity, toCity);
}

// ================================
// MAP
// ================================
const map = L.map('map').setView(start, 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// ================================
// MARKER
// ================================
const busIcon = L.divIcon({
    className: "",
    html: `<div style="
        width:40px;height:40px;
        background:red;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:18px;">🚌</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

let marker = L.marker(start, { icon: busIcon }).addTo(map);

// ================================
// ROUTE
// ================================
let routeCoords = [];

const routing = L.Routing.control({
    waypoints: [
        L.latLng(start),
        L.latLng(end)
    ],
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null,
    lineOptions: {
        styles: [{ color: "#2ecc71", weight: 6 }]
    }
}).addTo(map);

// ================================
// ROUTE READY
// ================================
routing.on('routesfound', function(e) {

    routeCoords = e.routes[0].coordinates;

    console.log("✅ ROUTE LOADED:", routeCoords.length);

    startMovement(); // start after route
});

// ================================
// 🔥 SMOOTH REALISTIC MOVEMENT
// ================================
function startMovement() {

    let i = 0;

    function move() {

        if (routeCoords.length === 0) return;

        if (i >= routeCoords.length) i = 0;

        const pos = routeCoords[i];

        marker.setLatLng([pos.lat, pos.lng]);

        // smoother pan
        map.panTo([pos.lat, pos.lng], {
            animate: true,
            duration: 0.5
        });

        i++;

        // dynamic speed (real feel)
        const speedDelay = Math.random() * 80 + 120;

        setTimeout(move, speedDelay);
    }

    move();
}

// ================================
// SPEED DISPLAY
// ================================
setInterval(() => {
    document.getElementById("speed").innerText =
        Math.floor(Math.random() * 20 + 50) + " km/h";
}, 2000);

// ================================
// 🔥 FUTURE: REAL-TIME SOCKET READY
// ================================
const socket = io("http://localhost:5000");

socket.on("busLocation", (data) => {

    console.log("📡 LIVE LOCATION:", data);

    marker.setLatLng([data.lat, data.lng]);

    map.panTo([data.lat, data.lng]);
});