const busContainer = document.getElementById("busContainer");

async function loadBuses(){

try{

const response = await fetch("http://localhost:5000/api/buses");

const buses = await response.json();

busContainer.innerHTML = "";

buses.forEach(bus => {

const card = document.createElement("div");

card.className = "busCard";

card.innerHTML = `

<div class="busDetails">

<h3>${bus.busName}</h3>

<div class="busRoute">
<span>From: ${bus.from}</span>
<span>To: ${bus.to}</span>
</div>

<div class="busMeta">
<span>Departure: ${bus.departureTime}</span>
<span class="price">₹${bus.price}</span>
</div>

</div>

<div class="busButton">

<button onclick='selectBus(${JSON.stringify(bus)})'>
Select Seats
</button>

</div>

`;

busContainer.appendChild(card);

});

}catch(err){

console.log(err);

busContainer.innerHTML = "<p>Failed to load buses</p>";

}

}
function selectBus(bus){

    console.log("SELECTED:", bus); // ✅ DEBUG

    localStorage.setItem("selectedBus", JSON.stringify(bus));

    window.location.href = "seat.html";
}

function filterBuses() {
    const val = document.getElementById("search").value.toLowerCase();

    document.querySelectorAll(".busCard").forEach(card => {
        card.style.display =
            card.innerText.toLowerCase().includes(val)
            ? "block"
            : "none";
    });
}

loadBuses();