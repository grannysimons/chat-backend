
// module.exports = {
//   socketConnected : (socket) => {
//     const io = require('./bin/www').io;
//     console.log('Socket id: ', socket.id);
//     io.emit('TYPING','an event sent to all connected clients');
//     io.emit('BU','BU event sent to all connected clients');
  
  
//     socket.on('TYPING', ()=>{
//       console.log("algú ha clicat el botó!!!");
//     })
//     socket.on('HOLA', ()=>{
//       console.log("rebut event HOLA de client a servidor!!");
//     });
//   }
// }

module.exports = {
  socketConnected : (socket) => {
    const io = require('./bin/www').io;
    console.log('Socket id: ', socket.id);
    io.emit('TYPING','an event sent to all connected clients');
    io.emit('BU','BU event sent to all connected clients');
  
  
    socket.on('TYPING', ()=>{
      console.log("algú ha clicat el botó!!!");
    })
    socket.on('HOLA', ()=>{
      console.log("rebut event HOLA de client a servidor!!");
    });
  },
  messageSent : (user, chatId) => {
    const io = require('./bin/www').io;
    io.emit('MESSAGE_SENT',{user, chatId});
  
    // socket.on('TYPING', ()=>{
    //   console.log("algú ha clicat el botó!!!");
    // })
    // socket.on('HOLA', ()=>{
    //   console.log("rebut event HOLA de client a servidor!!");
    // });
  }
}