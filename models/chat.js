const mongoose = require('mongoose');
const Schema = mongoose.Schema;

chatSchema = new Schema({
  idChat: Schema.Types.ObjectId,
  user1: {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
    lastSeen: Number
  },
  user2: {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    email: String,
    lastSeen: Number
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;