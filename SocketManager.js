// class SocketManager {
//   constructor(){
//     console.log('constructor SocketManager');
//     this.socket = null;
//     this.io = require('./bin/www').io;
//     this.chatId = null;
//   }
//   socketConnected(socket){
//     console.log('socketConnected');
//     this.socket = socket;
//     console.log('Socket id: ', socket.id);
//   }
//   newChat(chatId){
//     console.log('newChat');
//     this.chatId = chatId;
//     this.io.on('connection', function(socket){
//       console.log('newChat: chatId: ', chatId);
//       socket.join(chatId);
//     });
//   }
//   messageSent(message){
//     console.log('messageSent');
//     this.io.to(this.chatId).emit('MESSAGE_SENT', message);
//   }
// }

// var socketManager = new SocketManager();
// module.exports = socketManager;




// // module.exports = {
// //   socketConnected : (socket) => {
// //     const io = require('./bin/www').io;
// //     console.log('Socket id: ', socket.id);
// //     io.emit('TYPING','an event sent to all connected clients');
// //     io.emit('BU','BU event sent to all connected clients');
  
  
// //     socket.on('TYPING', ()=>{
// //       console.log("algú ha clicat el botó!!!");
// //     })
// //     socket.on('HOLA', ()=>{
// //       console.log("rebut event HOLA de client a servidor!!");
// //     });
// //   },
// //   messageSent : (message) => {
// //     const io = require('./bin/www').io;
// //     io.emit('MESSAGE_SENT',message);
  
// //     // socket.on('TYPING', ()=>{
// //     //   console.log("algú ha clicat el botó!!!");
// //     // })
// //     // socket.on('HOLA', ()=>{
// //     //   console.log("rebut event HOLA de client a servidor!!");
// //     // });
// //   }
// // }