const express = require("express");

const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const newUser = await user.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, password: password });
    if (!user) {
      return res.status(400).json({ message: "Login failed" });
    } else {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      return res.status(200).json(temp);
    }
    
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallusers", async (req, res) => { 

  try {
    const users = await User.find()
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
