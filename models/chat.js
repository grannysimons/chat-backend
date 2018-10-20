const mongoose = require('mongoose');
const Schema = mongoose.Schema;

chatSchema = new Schema({
  idChat: Schema.Types.ObjectId,
  // user1: String, //mail
  // user2: String,  //mail
  user1: {
    email: String,
    lastSeen: Number
  },
  user2: {
    email: String,
    lastSeen: Number
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;