const mongoose = require('mongoose');
const Schema = mongoose.Schema;

chatSchema = new Schema({
  idChat: Schema.Types.ObjectId,
  // user1: String, //mail
  // user2: String,  //mail
  user1: {
    email: String,
    lastSeen: { Type: Date }
  },
  user2: {
    email: String,
    lastSeen: { Type: Date }
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;