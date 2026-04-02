/* =========================
   REGISTER
========================= */
async function register() {

    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    try {

        const res = await fetch("https://transitcloud-backend-service-production.onrender.com/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Account created successfully");
        window.location = "login.html";

    } catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
}


/* =========================
   LOGIN (🔥 IMPORTANT FIX)
========================= */
async function login() {

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    try {

        const res = await fetch("https://transitcloud-backend-service-production.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        /* 🔥 STORE USER CORRECTLY */
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login Successful");

        window.location.href = "buses.html";

    } catch (error) {
        console.log(error);
        alert("Login failed");
    }
}