const mongoose = require('mongoose');
const Schema = mongoose.Schema;

messageSchema = new Schema({
  idMessage: Schema.Types.ObjectId,
  text: String,
  time: String,
  user: String,
  idChat: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;