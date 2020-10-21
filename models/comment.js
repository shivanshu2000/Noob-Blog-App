const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  userName: {
    type: String,
  },
});

// commentSchema.pre(/^find/, function (next) {
//   this.populate("userId");
//   this.save();
//   next();
// });

module.exports = mongoose.model("Comments", commentSchema);
