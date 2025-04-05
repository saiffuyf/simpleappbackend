const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, "Please enter a valid email address"] 
  },
  password: { type: String, required: true, minlength: 6 },
  // **profilePicture: { type: String, default: "" }  // Added profile picture field
  profilePicture: {
    data: Buffer,             // binary image data
    contentType: String       // e.g. 'image/png'
  }
});

module.exports = mongoose.model("User", UserSchema);
