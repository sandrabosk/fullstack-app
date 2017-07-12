const express = require ('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const ensure = require('connect-ensure-login');
const User = require('../models/user-model.js');

const authRoutes = express.Router();

authRoutes.get('/signup',
  ensure.ensureNotLoggedIn('/'), // <-- page(s) who see not logged in users
  (req, res, next)=>{ res.render('auth/signup-view.ejs');
  });

//receiving and processing form
authRoutes.post('/signup',
  (req, res, next)=>{
  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

//don't let users submit blank usernames or passwords
  if (signupUsername === '' || signupPassword === ''){
    res.status(400).json({ message: 'Provide username and password.' });
    return;
  }

  User.findOne(
    //1st arg->criteria of the findOne(which documents)
    {username: signupUsername },
    //2nd arg -> projection (which fields)
    {username:1},
    //3rd arg -> callback
    (err, foundUser) => {
      if (err){
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

      //don't let user register if the username is taken
      if (foundUser){
        res.status(400).json({ message: 'The username already exists.' });
        return;
      }
        //encrypt the password
      const salt = bcrypt.genSaltSync(10); //signupPassword is the one user provided
      const hashPass = bcrypt.hashSync(signupPassword, salt);


        //create theUser
      const theUser = new User({
        name: req.body.signupName,
        username:req.body.signupUsername,
        encryptedPassword: hashPass
      });

        //save theUser
      theUser.save((err)=>{
        if (err){
          res.status(500).json({ message: 'Something went wrong.' });
          return;
        }

//==================
req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

      res.status(200).json(req.user);
       });
//==================
    });
  });
});

// ============ LOG IN ================ //

authRoutes.get('/login',
    ensure.ensureNotLoggedIn('/'),
    (req, res, next) =>{
  res.render('auth/login-view.ejs', {
    errorMessage: req.flash('error')
  });
});

authRoutes.post('/login',(req,res,next)=>{                     //  |
    // ensure.ensureNotLoggedIn('/'),            //  |
    passport.authenticate('local',(err, theUser, failureDetails)=>{  //<------------
    if (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }

      if (!theUser) {
        res.status(401).json(failureDetails);
        return;
      }

      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong' });
          return;
        }

        // We are now logged in (notice req.user)
        res.status(200).json(req.user);
      });
    })(req, res, next);
});
// =============== END LOG IN ================== //



// ================ LOG OUT ================== //

authRoutes.get('/logout', (req, res, next)=>{
  req.logout();
  res.status(200).json({ message: 'Success.' });
});
// ================ END LOG OUT ================== //

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(401).json({ message: 'Unauthorized.' });
});

function gtfoIfNotLogged (req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'FORBIDDEN.' });
    return;
  }
  next();
}

// ================ SOCIAL LOG INS ================== //



authRoutes.get('/auth/facebook',passport.authenticate('facebook'));
authRoutes.get('/auth/facebook/callback', passport.authenticate('facebook',{
  successRedirect: '/',
  failureRedirect:'/login'
}));

authRoutes.get('/auth/google', passport.authenticate('google',{
  scope: ['https://www.googleapis.com/auth/plus.login',
          'https://www.googleapis.com/auth/plus.profile.emails.read']
}));
authRoutes.get('/auth/google/callback', passport.authenticate('google',{
  successRedirect: '/',
  failureRedirect:'/login'
}));

module.exports = authRoutes;
