const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Routes
router.get("/", async (req, res) => {
  const user = await User.find()
    .populate("bookBorrowed", "bookName")
    .select("-passwordHash");
  if (!user) {
    return res.status(400).send({ msg: "user not found" });
  }
  res.status(200).send(user);
});
router.get("/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
    .populate("bookBorrowed", "bookName")
    .select("-passwordHash");
  if (!user) {
    return res.status(400).send({ msg: "user not found" });
  }
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    bookBorrowed: req.body.bookBorrowed,
  });
  if (!user) {
    return res.status(400).send({ msg: "unable to add user" });
  }
  user = await user.save();
  res.send(user);
  console.log(user);
});
router.put("/:id", async (req, res) => {
  try {
    // Ensure `id` is valid for MongoDB
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ msg: "Invalid user ID" });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        bookBorrowed: req.body.bookBorrowed,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(400)
        .send({ msg: "User not found or could not be updated" });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send({ msg: "Server error", error: error.message });
  }
});
router.post('/login',async(req,res)=>{
  const user = await User.findOne({email:req.body.email})
  const secret = process.env.secret
  if(!user){
    return res.status(400).send({msg:"user not found..."})
  }
  if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
    const token= jwt.sign({
      userName:user.name
    },secret,{expiresIn:'1d'})
    return res.send({token:token})
  }
  else{
    return res.send({msg:"password doesnt match"})
  }
})
router.delete("/:id", async (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).send({ msg: "user deleted..." }))
    .catch((err) => res.status(400).send({ msg: err.name }));
});
module.exports = router;
