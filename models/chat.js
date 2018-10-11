const mongoose = require('mongoose');
const Schema = mongoose.Schema;

chatSchema = new Schema({
  idChat: Schema.Types.ObjectId,
  user1: Schema.Types.ObjectId,
  user2: Schema.Types.ObjectId,
});

const Chat = mongoose.model('Chat', messageSchema);

module.exports = Chat;