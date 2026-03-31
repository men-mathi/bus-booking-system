const router = require("express").Router();
const { sendMessage, getMessages } = require("../controllers/contactController");

/* SEND MESSAGE */
router.post("/", sendMessage);

/* GET ALL MESSAGES (ADMIN) */
router.get("/", getMessages);

module.exports = router;