const mongoose = require('mongoose');
console.log('database.js');

// mongoose.connect(process.env.MONGODB_URI) 
mongoose.connect('mongodb://localhost:27017/txat') 
  .then(() => {
    console.log('connected to database 😀');
  })
  .catch(() => {
    console.log('not connected to database 😔');
    mongoose.connection.close();
  })

  module.exports = mongoose;