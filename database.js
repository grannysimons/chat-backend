const mongoose = require('mongoose');

// console.log('db: ', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI) 
  .then(() => {
    console.log('connected to database 😀');
  })
  .catch(() => {
    console.log('not connected to database 😔');
    mongoose.connection.close();
  })

  module.exports = mongoose;