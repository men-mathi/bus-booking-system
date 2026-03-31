const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({

busName:{
type:String,
required:true
},

from:{
type:String,
required:true
},

to:{
type:String,
required:true
},

departureTime:{
type:String,
required:true
},

price:{
type:Number,
required:true
}

});

module.exports = mongoose.model("Bus", busSchema);