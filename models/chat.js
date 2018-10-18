const mongoose = require('mongoose');
const Schema = mongoose.Schema;

chatSchema = new Schema({
  idChat: Schema.Types.ObjectId,
  // user1: Schema.Types.ObjectId,
  // user2: Schema.Types.ObjectId,
  user1: String,
  user2: String,
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;