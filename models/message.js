const mongoose = require('mongoose');
const Schema = mongoose.Schema;

messageSchema = new Schema({
  idMessage: Schema.Types.ObjectId,
  text: String,
  time: Number,
  user: String,
  idChat: Schema.Types.ObjectId,
  isAudio: Boolean,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;