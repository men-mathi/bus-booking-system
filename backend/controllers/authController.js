const User = require("../models/User");

/* Register */

const registerUser = async (req, res) => {

try {

const { name, email, password } = req.body;

const existingUser = await User.findOne({ email });

if(existingUser){
return res.status(400).json({
message:"Email already registered"
});
}

const user = new User({
name,
email,
password
});

await user.save();

res.json({
message:"User Registered Successfully"
});

} catch (error) {

console.log(error);

res.status(500).json({
message:"Server error"
});

}

};


/* Login */

const loginUser = async (req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email,password});

if(!user){
return res.status(400).json({
message:"Invalid email or password"
});
}

res.json({
message:"Login successful",
user
});

}catch(error){

console.log(error);

res.status(500).json({
message:"Server error"
});

}

};

module.exports = { registerUser, loginUser };