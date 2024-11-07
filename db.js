const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_HOST = `mongodb+srv://dobapmin:${process.env.DB_PASSWORD}@dobapmin.gypgs.mongodb.net/?retryWrites=true&w=majority&appName=Dobapmin`;
mongoose
  .connect(MONGO_HOST, {
    retryWrites: true,
    w: "majority",
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.log(err));

module.exports = mongoose;
