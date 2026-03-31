const express = require("express");
const router = express.Router();

const { getBuses } = require("../controllers/busController");

/* GET all buses */

router.get("/", getBuses);

module.exports = router;