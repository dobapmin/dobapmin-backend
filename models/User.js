const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
  },
  nickname: {
    type: String,
    requried: [true],
  },
});

userSchema.statics.login = async function (nickname) {
  const user = await this.findOne({ nickname });

  if (user) {
    console.log("nickname", nickname, "found", user);
    return user;
  } else {
    throw new Error("사용자를 찾을 수 없습니다.");
  }
};
const User = mongoose.model("user", userSchema);
module.exports = User;
