const express = require("express");

const router = express.Router();

const Room = require("../models/room");

router.get("/getAllRooms", async (req, res) => {
  try {
    const room = await Room.find({});
    return res.status(200).json(room);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/getroombyid", async (req, res) => {
  const roomid = req.body.roomid;
  try {
    const room = await Room.findOne({ _id: roomid });
    return res.status(200).json(room);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//Create room
router.post("/addroom", async (req, res) => {
  try {
    // const room = await Room.create({
    //   name: req.body.name,
    //   maxcount: req.body.maxcount,
    //   phonenumber: req.body.phonenumber,
    //   rentperday: req.body.rentperday,
    //   imageurls: req.body.imageurls,
    //   currentbookings: [],
    //   type: req.body.type,
    //   description: req.body.description,
    // });

    const newroom = new Room(req.body);
    await newroom.save();
    // return res.status(201).json("Room added successfully");
    res.json("Room added successfully");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
