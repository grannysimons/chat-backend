const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/user');

router.get('/me', function(req, res, next) {
  console.log('me');
  if(req.session.currentUser)
  {
    res.json(req.session.currentUser);
  }
  else
  {
    res.status(404).json({ error: 'not-logged' });
  }
});

router.post('/login', function(req, res, next) {
  console.log('login');
  if(req.session.currentUser)
  {
    res.status(401).json({ error: 'unauthorized' });
  }
  const userName = req.body.username;
  const password = req.body.password;

  if(!username || !password)
  {
    res.status(422).json({ error: 'validation' });
  }

  User.findOne({ userName })
  .then(( user ) => {
    if(!user)
    {
      res.status(404).json({ error: 'not-found' });
    }
    if(bcrypt.compareSync(password, user.password))
    {
      req.session.currentUser = user;
      res.json(user);
    }
    else
    {
      res.status(404).json({ error: 'not-found' });
    }
  })
});

router.post('/signup', function(req, res, next) {
  console.log('signup');
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password)
  {
    res.status(422).json({ error: 'validation' })
  }
  User.findOne({ email })
  .then((user) => {
    if( user )
    {
      res.status(422).json({ error: 'username-not-unique' });
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      userName,
      password: hashPass,
    });

    return newUser.save()
    .then(() => {
      req.session.currentUser = newUser;
      req.json(newUser);
    })
  })

});

router.post('/logout', function(req, res, next) {
  console.log('logout');
  delete req.session.currentUser;
  res.status(204).send();
});

router.get('/private', function(req, res, next) {
  console.log('private');
  if(req.session.currentUser)
  {
    res.status(200).json({ message: 'private message' });
  }
  res.status(403).json({ message: 'unauthorized' })
});

module.exports = router;
