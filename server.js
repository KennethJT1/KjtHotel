const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const roomRoute = require("./routes/roomsRoute");
const userRoute = require("./routes/userRoute");
const bookingRoute = require("./routes/bookingRoute");
const cors = require("cors");
dotenv.config();

const app = express();

//mongodb
const db = require("./db");

app.use(express.json());
app.use(cors());

//routes
app.use("/api/room", roomRoute);
app.use("/api/user", userRoute);
app.use("/api/booking", bookingRoute);

const port = process.env.PORT || 3001;

app.listen(port, () =>
  console.log(`Hotel is listening on http://localhost:${port}`.yellow.bold)
);
