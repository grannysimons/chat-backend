const { NEW_CHAT, NEW_USER, MESSAGE_RECEIVED, TYPING, STOPPED_TYPING} = require('./events');

class SocketManager {
  constructor(){
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
    this.connectToNamespace(to);
    this.socket.emit(NEW_CHAT, chat);
    this.socket.on('disconnection', function(){
      console.log('desconnectat');
    })
  }
  newUser(userId){
    this.connectToNamespace(userId);
  }
  messageReceived(message, toUserId, fromUserMail){
    this.connectToNamespace(toUserId);
    this.socket.emit(MESSAGE_RECEIVED, fromUserMail);
  }
  connectToNamespace (nsp){
    console.log('connectToNamespace', nsp);
    this.socket = this.io.of('/'+nsp);
    this.socket.on('connection', (sk) => {
      console.log('connectat!!!');
    });
    this.socket.on(TYPING, (msg) => {
      console.log('user typing! msg: ', msg);
    });
    this.socket.on(STOPPED_TYPING, (sk) => {
      console.log('user stopped typing!');
    });
   
    return;
  }
  userConnected (){

  }
  userDisconnected(){

  }
  userTyping(userId){
    this.connectTotNamespace(userId);
    this.socket.on('broadcast', (message) => {
      console.log('broadcast event: ',message);
    })
  }
  userStoppedTyping(){

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