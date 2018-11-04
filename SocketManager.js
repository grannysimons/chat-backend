const { NEW_CHAT, NEW_USER, MESSAGE_RECEIVED, TYPING, STOPPED_TYPING} = require('./events');
const SocketIOFile = require('socket.io-file');

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
  typing(destUserId, idChat){
    this.connectToNamespace(destUserId);
    this.socket.emit(TYPING, idChat);
  }
  stoppedTyping(destUserId, idChat){
    this.connectToNamespace(destUserId);
    this.socket.emit(STOPPED_TYPING, idChat);
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
}

module.exports = new SocketManager();