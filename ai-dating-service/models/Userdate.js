const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Userdate", UserSchema);
