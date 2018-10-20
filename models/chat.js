const mongoose = require('mongoose');
const Schema = mongoose.Schema;

chatSchema = new Schema({
  idChat: Schema.Types.ObjectId,
  user1: String, //mail
  user2: String,  //mail
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;