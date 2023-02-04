const mongoose = require("mongoose");
const colors = require("colors");

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.set("strictQuery", false);

let connection = mongoose.connection;

connection.on("error", () => {
  console.log("MongoDb connection failed".red.charCodeAt);
});

connection.on("connected", () => {
  console.log("MongoDb connection...".blue.bold);
});

module.exports = mongoose;
