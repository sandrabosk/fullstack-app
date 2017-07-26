const express = require ('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const ensure = require('connect-ensure-login');
const User = require('../models/user-model.js');

const authRoutes = express.Router();

// ======== '/api/signup' =============

authRoutes.post('/api/signup',
  (req, res, next)=>{
  const signupFirstName = req.body.signupFirstName;
  const signupLastName = req.body.signupLastName;
  const signupEmail = req.body.signupEmail;
  // const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

//don't let users submit blank usernames or passwords
  if (signupEmail === '' || signupPassword === ''){
    res.status(400).json({ message: 'Please provide username and password.' });
    return;
  }

  User.findOne(
    //1st arg->criteria of the findOne(which documents)
    // {username: signupUsername },
    { email: signupEmail },
    //2nd arg -> projection (which fields)
    // {username:1},
    { email:1 },

    //3rd arg -> callback
    (err, foundUser) => {
      if (err){
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

      //don't let user register if the username is taken
      if (foundUser){
        res.status(400).json({ message: 'The user is already registered with that email.' });
        return;
      }
        //encrypt the password
      const salt = bcrypt.genSaltSync(10); //signupPassword is the one user provided
      const hashPass = bcrypt.hashSync(signupPassword, salt);


        //create theUser
      const theUser = new User({
        firstName: signupFirstName,
        lastName: signupLastName,
        email: signupEmail,
        encryptedPassword: hashPass
      });

        //save theUser
      theUser.save((err)=>{
        if (err){
          res.status(500).json({ message: 'Could not save the user in the database.' });
          return;
        }

//==================
req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Login went wrong.' });
        return;
      }
      // res.status(200).json(theUser);

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

authRoutes.post('/api/login',(req,res,next)=>{
    passport.authenticate('local',(err, theUser, failureDetails)=>{
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
          res.status(500).json({ message: 'Passport login went wrong' });
          return;
        }

        // We are now logged in (notice req.user)
        res.status(200).json(req.user);
      });
    })(req, res, next);
});
// =============== END LOG IN ================== //



// ================ LOG OUT ================== //

authRoutes.post('/api/logout', (req, res, next)=>{
  req.logout();
  res.status(200).json({ message: 'Success.' });
});
// ================ END LOG OUT ================== //

authRoutes.get('/api/checklogin', (req, res, next) => {
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
