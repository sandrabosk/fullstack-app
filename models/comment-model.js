const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  commenter: { type: Schema.Types.ObjectId },
  content: { type: String }
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
