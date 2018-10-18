const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/user');
const { loggedIn } = require('../helpers/is-logged');
const { notLoggedIn } = require('../helpers/is-not-logged');

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

router.post('/login', notLoggedIn(), function(req, res, next) {
  console.log('login: ',req.body);
  if(req.session.currentUser)
  {
    res.status(401).json({ error: 'unauthorized' });
  }
  const email = req.body.email;
  const password = req.body.password;

  console.log('email: ', email);
  console.log('password: ', password);

  if(!email || !password)
  {
    res.status(422).json({ error: 'validation' });
  }
  console.log('1');
  User.findOne({ email })
  .then(( user ) => {
    if(!user)
    {
      console.log('2');
      res.status(404).json({ error: 'not-found' });
    }
    if(bcrypt.compareSync(password, user.password))
    {
      console.log('3');
      req.session.currentUser = user;
      res.json(user);
    }
    else
    {
      console.log('4');
      res.status(404).json({ error: 'not-found' });
    }
  })
  return;
});

router.post('/signup', notLoggedIn(),function(req, res, next) {
  console.log('signup');
  const email = req.body.email;
  const password = req.body.password;

  console.log('1 ', email,', ',password);
  if(!email || !password)
  {
    console.log('222222');
    return res.status(422).json({ error: 'validation' });
    console.log('222222 BIS');
  }
  User.findOne({ email })
  .then((user) => {
    if( user )
    {
      console.log('3');
      return res.status(422).json({ error: 'username-not-unique' });
    }
    console.log('4');
    
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      email,
      password: hashPass,
    });
  console.log('5');

    return newUser.save()
    .then(() => {
      console.log('6');

      req.session.currentUser = newUser;
      return res.json(newUser);
    })
  })

});

router.post('/logout', loggedIn(), function(req, res, next) {
  console.log('logout');
  delete req.session.currentUser;
  return res.status(204).send();
});

router.get('/private', loggedIn(), function(req, res, next) {
  console.log('private');
  if(req.session.currentUser)
  {
    res.status(200).json({ message: 'private message' });
  }
  res.status(403).json({ message: 'unauthorized' })
});

module.exports = router;
