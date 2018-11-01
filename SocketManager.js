const { NEW_CHAT, NEW_USER } = require('./events');

class SocketManager {
  constructor(){
    console.log('constructor SocketManager');
    // this.io=io;
    // this.socket = this.io.of('/5bcf31b8f54f1068ca7fb3f7');
  }
  initIO(io){
    this.io=io;
  }
  testMethod(){
    const socket = this.io.of('/5bcf31b8f54f1068ca7fb3f7');
    socket.on('connection', ()=>{
      // socket.emit(NEW_CHAT, chat);
      socket.emit('NEW_CHAT', 'hola newchat!');
      socket.on('disconnection', function(){
        console.log('desconnectat');
      })
    })
    const socket2 = this.io.of('/5bcb07a3a91cfc39b30ee69c');
    socket2.on('connection', ()=>{
      // socket.emit(NEW_CHAT, chat);
      socket2.emit('NEW_CHAT', 'hola newchat!');
      socket2.on('disconnection', function(){
        console.log('desconnectat');
      })
    })
  }
  newChat({ from, to , chat}){
    console.log('newChat!!!');
    let socket = this.connectToNamespace(to);
    socket.emit(NEW_CHAT, chat);
    socket.on('disconnection', function(){
      console.log('desconnectat');
    })
  }
  newUser(userId){
    console.log('newUser. userId: ', userId);

    this.connectToNamespace(userId);


    // this.mailSockets[userId] = this.io.to('/',userId);
    // this.mailSockets[userId].emit('NEW_USER', message);
  }

  connectToNamespace (nsp){
    console.log('connectToNamespace: ',nsp);
    this.socket = this.io.of('/'+nsp);
    this.socket.on('connection', (sk) => {
      console.log('connection ok');
      sk.emit(NEW_USER, 'new user de prova');  //de prova
      this.socket.emit(NEW_CHAT, 'new chat de prova'); //de prova
    });
    // return socket;
    return;
  }
  userConnected (){

  }
  userDisconnected(){

  }
  userTyping(){

  }
  userStoppedTyping(){

  }
  
  messageSent(message){
    // console.log('messageSent');
    // this.io.to(this.chatId).emit('MESSAGE_SENT', message);
  }
  socketConnected(socket){
    this.socket = socket;
  }
  signUp(email){
    // let event = `/${email}`
    // this.io.on(event, () => {
    //   console.log("signup. Email: ", email);
    // });
  }
  
}

module.exports = new SocketManager();




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