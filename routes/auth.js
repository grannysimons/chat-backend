const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/user');
const { loggedIn } = require('../helpers/is-logged');
const { notLoggedIn } = require('../helpers/is-not-logged');

const SocketManager = require('../SocketManager');
// io.on('connection', SocketManager.socketConnected);

router.get('/me', function(req, res, next) {
  if(req.session.currentUser)
  {
    return res.json(req.session.currentUser);
  }
  else
  {
    return res.status(404).json({ error: 'not-logged' });
  }
});

router.post('/login', notLoggedIn(), function(req, res, next) {
  if(req.session.currentUser)
  {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password)
  {
    return res.status(422).json({ error: 'validation' });
  }
  User.findOne({ email })
  .then(( user ) => {
    if(!user)
    {
      return res.status(404).json({ error: 'not-found' });
    }
    if(bcrypt.compareSync(password, user.password))
    {
      req.session.currentUser = user;
      console.log('currentUser: ',req.session.currentUser);
      return res.json(user);
    }
    else
    {
      return res.status(404).json({ error: 'not-found' });
    }
  })
  return;
});

router.post('/signup', notLoggedIn(),function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password)
  {
    return res.status(422).json({ error: 'validation' });
  }
  User.findOne({ email })
  .then((user) => {
    if( user )
    {
      return res.status(422).json({ error: 'username-not-unique' });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      email,
      password: hashPass,
    });
    return newUser.save()
    .then(() => {
      req.session.currentUser = newUser;
      console.log('signup - newUser: ', newUser);
      return res.json(newUser);
    })
  })

});

router.post('/logout', loggedIn(), function(req, res, next) {
  delete req.session.currentUser;
  return res.status(204).send();
});

router.get('/private', loggedIn(), function(req, res, next) {
  if(req.session.currentUser)
  {
    res.status(200).json({ message: 'private message' });
  }
  res.status(403).json({ message: 'unauthorized' })
});

router.post('/profile', loggedIn(), function(req, res, next) {
  if(req.session.currentUser)
  {
    let userData = {
      name: '',
      email: '',
      password: '',
      quote: '',
    }
    User.findById( req.session.currentUser._id )
    .then(user => {
      userData.name = user.userName;
      userData.email = user.email;
      userData.password = '';
      userData.quote = user.quote;
      return res.json(userData);
    })
  }
  else
  {
    return res.status(404).json({ error: 'not-logged' });
  }
});

router.post('/profile/edit', loggedIn(), function(req, res, next) {
  const field = req.body.field; //object
  const value = req.body.value; //string
  let updateData = {}
  if(field.name) updateData.userName = value;
  else if(field.email) updateData.email = value;
  else if(field.quote) updateData.quote = value;
  User.findByIdAndUpdate(req.session.currentUser._id, updateData, { 'new': true})
  .then(result => {
    User.findById(result._id)
    .then(( user ) => {
      if(!user)
      {
        res.status(404).json({ error: 'not-found' });
      }
      req.session.currentUser = user;
      res.json(user);
    })
    return res.json(result);
  })
});

module.exports = router;
