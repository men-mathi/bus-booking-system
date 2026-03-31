// get form element
const form = document.getElementById("contactForm");

// check if form exists
if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

// collect form values
const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const subject = document.getElementById("subject").value.trim();
const message = document.getElementById("message").value.trim();

// basic validation
if(!name || !email || !subject || !message){

alert("Please fill all fields");

return;

}

// data to send
const data = {
name,
email,
subject,
message
};

try{

const res = await fetch("http://localhost:5000/api/contact/send",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(data)

});

// check server response
if(!res.ok){

throw new Error("Server error");

}

const result = await res.json();

// success message
alert(result.message || "Message sent successfully");

form.reset();

}catch(err){

console.error(err);

alert("Failed to send message. Please try again.");

}

});

}