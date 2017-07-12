const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  content: { type: String },
  commenter: { type: Schema.Types.ObjectId }
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
