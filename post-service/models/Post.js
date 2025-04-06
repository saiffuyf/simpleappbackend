// const mongoose = require("mongoose");

// const PostSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   username: { type: String},
//   profilePicture: { type: String, default: "" },
//   imageUrl: { type: String},
//   caption: { type: String, maxlength: 500 },
  
//   // likes: { type: Number, default: 0 },
//   comments: [
//     {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       username: String,
//       text: String,
//       createdAt: { type: Date, default: Date.now }
//     }
//   ],
  
//   likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Post", PostSchema);



const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String },
  profilePicture: { type: String, default: "" },
  image: {
    data: Buffer,
    contentType: String
  },
  caption: { type: String, maxlength: 500 },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);


