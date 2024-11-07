const mongoose = require("mongoose");
const user2Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    unique: true,
  },
  nickname: {
    type: String,
    requried: [true],
  },
});
const User2 = mongoose.model("user2", user2Schema);
module.exports = User2;
