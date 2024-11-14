const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash:{
    type:String,
    required:true
  },
  phone: {
    type: String,
    required: true,
  },
  bookBorrowed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Book',
 
  }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
