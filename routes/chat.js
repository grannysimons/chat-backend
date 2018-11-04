var express = require('express');
var router = express.Router();
const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');
const mongoose = require('mongoose');

const SocketManager = require('../SocketManager');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log('destination!!');
    cb(null, 'public/audios/');
  },
  filename: function (req, file, cb) {
    // console.log('storage: file - ', file);
    let extension = '.wav';
    // if(file.mimetype === 'audio/mpeg-3' || file.mimetype === 'audio/mpeg') extension = '.mp3';
    if(file.mimetype === 'audio/mpeg-3') extension = '.mp3';

    cb(null, file.originalname + extension);
  }
})
const upload = multer({ storage });


dateChatFormat = ( date ) => {
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth()+1; //January is 0!

  var yyyy = date.getFullYear();
  if(dd<10){
      dd='0'+dd;
  } 
  if(mm<10){
      mm='0'+mm;
  } 
  var today = dd+'/'+mm+'/'+yyyy;
  return today;
}

router.post('/sendAudio', upload.single('audioFile'), (req, res, next) => {
  console.log('sendAudio: ', req.file);
  return res.json({ 'response': 'ok' });
});

router.post('/getUser/:email', (req,res,next) => {
  let email = req.params.email;
  User.findOne({ email })
  .then(user => {
    return res.json( user );
  })
})

router.post('/delete/:idUser', (req,res,next) => {
  let idUser = req.params.idUser;
  User.findByIdAndDelete(idUser)
  .then(user => {
    return res.json({ delete: "ok" });
  })
  .catch(error => {
    return res.json({ error });
  })
})

router.post('/newChat', (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if(user)
    {
      const filter = { 
        $or: [
          {$and: [{'user1.email': req.session.currentUser.email}, {'user2.email': req.body.email}]},
          {$and: [{'user1.email': req.body.email}, {'user2.email': req.session.currentUser.mail}]}
        ]
      };
      Chat.findOne(filter)
      .then(chat => {
        if(!chat)
        {
          const newChat = Chat({
            dateLastMessage: Date.now(),
            user1: {
              idUser: req.session.currentUser._id, 
              email: req.session.currentUser.email,
              lastSeen: Date.now(),
            },
            user2: {
              idUser: user._id,
              email: req.body.email,
              lastSeen: Date.now(),
            } 
          });
          return newChat.save()
          .then(() => {
            SocketManager.newChat({from: req.session.currentUser._id, to: user._id, chat});
            return res.json(newChat);
          })
          .catch((error) => {
            return res.json(error);
          })
        }
        else
        {
          // console.log("aquest xat ja existeix");
        }
      })
    }
  })
  .catch(error => {
    // console.log('error: ',error);
  })
});

router.post('/chatList', (req,res,next) => {
  let userMail = req.session.currentUser.email;
  Chat.find({ $or: [{ 'user1.email': userMail }, { 'user2.email': userMail }] })
  .populate('user1.idUser')
  .populate('user2.idUser')
  .sort({dateLastMessage: -1})
  .then(chats => {
    SocketManager.newUser(req.session.currentUser._id);

    // chats.forEach(chat => {
    //   const idUser = req.session.currentUser._id;
    //   idChat = chat._id;
    //   Chat.findById(idChat)
    //   .then(chat => {
    //     const lastSeenUser = chat.user1.idUser === idUser ? chat.user1.lastSeen : chat.user2.lastSeen;
    //     Message.find({ time: {$gt: lastSeenUser}})
    //     .then(messages => {
    //       let numberOfNewMessages = messages.length;
    //       chat.num = numberOfNewMessages;
    //     })
    //   })
    // });
    // console.log('chats: ', chats);
    return res.json({ chats });
  })
  .catch(error =>{
    console.log(error)
    return res.json({ error });
  });
})

router.post('/typing/:email', (req, res, next) => {
  let email = req.params.email;
  // let userId = req.session.currentUser._id;
  let filter = { $or: [
    {'user1.email': email},
    {'user2.email': email},
  ]};
  Chat.findOne(filter)
  .then(chat => {
    let idChat = chat._id;
    let idUserDest = chat.user1.email === email ? chat.user1.idUser : chat.user2.idUser;
    SocketManager.typing(idUserDest, idChat);
    return res.json({ result: 'ok' });
  })
  .catch(error => {
    console.log('SocketManager error: ', error);
  })
})

router.post('/stoppedTyping/:email', (req, res, next) => {
  let email = req.params.email;
  let filter = { $or: [
    {'user1.email': email},
    {'user2.email': email},
  ]};
  Chat.findOne(filter)
  .then(chat => {
    let idChat = chat._id;
    let idUserDest = chat.user1.email === email ? chat.user1.idUser : chat.user2.idUser;
    SocketManager.stoppedTyping(idUserDest, idChat);
    return res.json({ result: 'ok' });
  })
  .catch(error => {
    console.log('SocketManager error: ', error);
  })
})

router.post('/:email/send', (req,res,next) => {
  let message = req.body.message;
  let email = req.params.email; //destinatari
  let isAudio = req.body.isAudio;
  let filter = {
    $or: [
      {'user1.email': email, 'user2.email': req.session.currentUser.email},
      {'user2.email': email, 'user1.email': req.session.currentUser.email},
    ]
  };
  Chat.findOne(filter)
  .then(chat => {
    const newMessage = Message({
      text: message,
      time: new Date(),
      user: req.session.currentUser,  //origen
      idChat: chat._id,
      isAudio ,
    });
    return newMessage.save()
    .then(() => {
      Chat.findByIdAndUpdate(chat._id, {dateLastMessage: Date.now()})
      .then(chat => {
        const toUserid = chat.user1.idUser == req.session.currentUser._id ? chat.user2.idUser : chat.user1.idUser;
        const fromUserMail = chat.user1.idUser == req.session.currentUser._id ? chat.user1.email : chat.user2.email;
        SocketManager.messageReceived(newMessage.text, toUserid, fromUserMail);
        return res.json(newMessage);
      })
    })
  })
})

router.post('/:email', (req,res,next) => {
  let email = req.params.email;
  let filter = {
    $or: [
      {'user1.email': email, 'user2.email': req.session.currentUser.email},
      {'user2.email': email, 'user1.email': req.session.currentUser.email},
    ]
  };
  Chat.findOne(filter)
  .then(chat => {
    let idInterlocutor = chat.user1.idUser == req.session.currentUser._id ? chat.user2.idUser : chat.user1.idUser;
    User.findById(idInterlocutor)
    .then(user => {
      Message.find({ idChat:  chat._id})
      .then( messages => {
          let filter = {};
          if(chat.user1.idUser == req.session.currentUser._id)
          {
            filter = { user1: { lastSeen: Date.now() }}
          } 
          else
          {
            filter = { user2: { lastSeen: Date.now() }}
          } 
          Chat.findByIdAndUpdate(chat.idChat, filter)
          .then(chats => {
            let xatObject = {messages, interlocutor: user};
            return res.json(xatObject);
          })
        });
    })
  })
})

router.post('/:idUser/:idChat/totalNewMessages', (req, res, next)=>{
  const { idUser , idChat } = req.params;
  Chat.findById(idChat)
  .then(chat => {
    const lastSeenUser = chat.user1.idUser === idUser ? chat.user1.lastSeen : chat.user2.lastSeen;
    Message.find({ time: {$gt: lastSeenUser}})
    .then(messages => {
      let numberOfNewMessages = messages.length;
      console.log('number of new messages: ', numberOfNewMessages);
      return res.json({totalNewMessages: numberOfNewMessages});
    })
  })
  .catch(error => next(error));
});

module.exports = router;



// - POST /chat/list (així utilitzem currentuser)
//   - get list
// - GET /chat/:id
//   - get messages from concrete chat
// - POST /chat/:id
//   - publish message
// - POST /chat/new


//   - chat.list()
//   - chat.detail(idChat)
//   - chat.search({user: string, text: string})
//   - chat.create({user})
//   - chat.read(idChat)
//   - creates new chat  