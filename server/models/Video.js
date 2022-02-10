const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
  }
});

module.exports = Video = mongoose.model("videos", VideoSchema);