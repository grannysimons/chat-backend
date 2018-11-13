const { NEW_CHAT, NEW_USER, MESSAGE_RECEIVED, TYPING, STOPPED_TYPING} = require('./events');

class SocketManager {
  constructor(){
  }
  initIO(io){
    this.io=io;
  }
  newChat({ from, to , chat}){
    this.connectToNamespace(to);
    this.socket.emit(NEW_CHAT, chat);
    this.socket.on('disconnection', function(){
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
  newMessages(userId, idChat){
    this.connectToNamespace(userId);
    this.socket.emit(NEW_MESSAGES, idChat);
  }
  connectToNamespace (nsp){
    this.socket = this.io.of('/'+nsp);
    this.socket.on('connection', (sk) => {
    });
    this.socket.on(TYPING, (msg) => {
    });
    this.socket.on(STOPPED_TYPING, (sk) => {
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
    })
  }
  userStoppedTyping(){

  }
  socketConnected(socket){
    this.socket = socket;
  }
}

module.exports = new SocketManager();