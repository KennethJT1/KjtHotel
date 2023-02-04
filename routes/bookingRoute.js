const express = require("express");
const moment = require("moment");
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");

const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//BOOK A ROOM
router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "ngn",
        receipt_email: token.email,
      },
      {
        //to ensure the customer is not charged twice
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        transactionid: "1234",
      });
      const booking = await newBooking.save();

      // TO UPDATE THE FIELD IN ROOM THAT IS YET TO BE PUT AND SAVE BOOKED HOTEL
      const roomtemp = await Room.findOne({ _id: room._id });

      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid,
        status: booking.status,
      });

      await roomtemp.save();
    }

    return res.status(201).send("Congrat, your room is booked");
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      msg: "Failed to book",
    });
  }
});

// GET A ROOM BY IT ID
router.post("/getbookingsbyuserid", async (req, res) => {
  const { userid } = req.body;

  try {
    const booking = await Booking.find({ userid });
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// CANCEL A ROOM
router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    //change the status of the cancel room
    const bookingItem = await Booking.findOne({ _id: bookingid });
    bookingItem.status = "cancelled";
    await bookingItem.save();

    //remove the room from been booked from fromdate to todate
    const room = await Room.findOne({ _id: roomid });
    const bookedRoom = room.currentbookings;

    const temp = bookedRoom.filter(
      (item) => item.bookingid.toString() !== bookingid
    );

    room.currentbookings = temp;
    await room.save();

    return res.status(200).json("Your booking cancelled successfully");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
    return res.status(200).json(bookings)
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;