var express = require('express');
var router = express.Router();
const Chat = require('../models/chat');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', (req, res, next) => {
  console.log('list!');
  if(!req.session.currentUser)
  {
    return res.status(443).json({message: 'not logged as a user'})
  }
  Chat.find({email: req.session.currentUser.email})
  .then(chats => {
    return res.status(200).json({ chats });
  })
  .catch(error => {
    return res.json({missatge: error});
    console.log('error: ', error);
  })
});

router.get('/:id', (req, res, next) => {

});

router.post('/:id', (req, res, next) => {

});

router.post('/newChat', (req, res, next) => {
  Chat.findOne({email: req.body.email})
  .then(chat => {
    if(!chat)
    {
      const newChat = Chat({
        
      })
    }
  })
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