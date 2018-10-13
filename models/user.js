const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema({
  idUser: Schema.Types.ObjectId,
  userName: String,
  email: String,
  password: String,
  imageURL: String,
  frase: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;