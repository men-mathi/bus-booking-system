const Bus = require("../models/Bus");

/* Get all buses */

const getBuses = async (req, res) => {

try {

const buses = await Bus.find();

res.json(buses);

} catch (error) {

console.log(error);

res.status(500).json({
message: "Server error"
});

}

};

module.exports = { getBuses };