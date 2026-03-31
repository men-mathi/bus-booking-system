const Contact = require("../models/Contact");


/* ------------------------------------------------
SEND CONTACT MESSAGE
------------------------------------------------ */

exports.sendMessage = async (req, res) => {

try {

const { name, email, subject, message } = req.body;

/* Validation */

if (!name || !email || !subject || !message) {

return res.status(400).json({
message: "All fields are required"
});

}

/* Create message */

const contact = new Contact({
name,
email,
subject,
message
});

/* Save to database */

await contact.save();

res.status(201).json({
message: "Message sent successfully"
});

} catch (error) {

console.error("Contact Error:", error);

res.status(500).json({
message: "Failed to send message"
});

}

};



/* ------------------------------------------------
GET ALL CONTACT MESSAGES (ADMIN)
------------------------------------------------ */

exports.getMessages = async (req, res) => {

try {

/* newest messages first */

const messages = await Contact.find().sort({ createdAt: -1 });

res.status(200).json(messages);

} catch (error) {

console.error("Load Messages Error:", error);

res.status(500).json({
message: "Error loading messages"
});

}

};