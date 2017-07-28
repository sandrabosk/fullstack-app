//here we are putting all passport files from app.js
const passport      = require('passport');
const User          = require('../models/user-model.js');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');


// =========================== social log ins ============= //

passport.serializeUser((user, cb)=>{
  cb ( null, user._id );
});

passport.deserializeUser((userId, cb) => {
  User.findById(userId, (err, theUser) => {
    if (err){
      cb(err);
      return;
    }
    cb(null, theUser);
  });
});


passport.use(new LocalStrategy(
    {
      usernameField: 'loginEmail',
      passwordField: 'loginPassword'
    },
  ( loginEmail, loginPassword, next )=>{
    User.findOne({ email: loginEmail },
      (err, theUser)=>{
        if (err){
          next(err);
          return;
        }
        if (!theUser){
          next(null, false, {message: 'Incorrect/invalid email.'});
          return;
        }

        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)){
          next(null, false, { message: 'Incorrect password!'});
          return;
        }

        next(null, theUser, {
          message: `Login for ${theUser.email} successful.`
        });
      });
  }));
