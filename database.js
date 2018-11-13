const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI) 
  .then(() => {
    console.log('connected to database 😀');
  })
  .catch(() => {
    console.log('not connected to database 😔');
    mongoose.connection.close();
  })

  module.exports = mongoose;