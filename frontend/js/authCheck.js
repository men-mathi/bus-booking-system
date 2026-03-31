// 🔐 STRONG AUTH CHECK (FINAL VERSION)

(function () {

    console.log("Auth check running...");

    const token = localStorage.getItem("token");

    // ❌ INVALID TOKEN CASES
    if (!token || token === "undefined" || token === "null") {
        alert("Please login first");
        window.location.href = "login.html";
    }

})();