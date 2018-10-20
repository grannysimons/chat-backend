var express = require('express');
var router = express.Router();
const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');
const mongoose = require('mongoose');


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/list', (req, res, next) => {
//   console.log('list!');
//   if(!req.session.currentUser)
//   {
//     return res.status(443).json({message: 'not logged as a user'})
//   }
//   Chat.find({email: req.session.currentUser.email})
//   .then(chats => {
//     return res.status(200).json({ chats });
//   })
//   .catch(error => {
//     return res.json({missatge: error});
//     console.log('error: ', error);
//   })
// });

// router.get('/:id', (req, res, next) => {

// });

// router.post('/:id', (req, res, next) => {

// });

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
            return res.json(newChat);
          })
          .catch((error) => {
            return res.json(error);
          })
        }
        else
        {
          console.log("aquest xat ja existeix");
        }
      })
    }
  })
  .catch(error => {
    console.log('error: ',error);
  })
});

router.post('/chatList', (req,res,next) => {
  let userMail = req.session.currentUser.email;
  Chat.find({ $or: [{ 'user1.email': userMail }, { 'user2.email': userMail }] })
  .populate('user1.idUser')
  .populate('user2.idUser')
  .then(chats => {
    console.log('chatList: ', chats[0].user1);
    chats.forEach((chat) => {
      let filter = {
        idChat: chat._id,
      }
      Message.find(filter)
      .sort({time: -1})
      .then(messages => {
        console.log(messages[0]);
      })
    });

    return res.json({ chats })
  })
})

router.post('/:idChat/send', (req,res,next) => {
  let message = req.body.message;
  let idChat = req.params.idChat;
  const newMessage = Message({
    text: message,
    time: Date.now(),
    user: req.session.currentUser,
    idChat,
  });
  return newMessage.save()
  .then(() => {
    return res.json(newMessage);
  })
})

router.post('/:idChat', (req,res,next) => {
  let idChat = req.params.idChat;
  Message.find({ idChat })
  .then( chats => {
    console.log('chats: ', chats);
  })
})

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