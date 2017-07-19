//here we are putting all passport files from app.js
const passport      = require('passport');
const User          = require('../models/user-model.js');
const FbStrategy    = require('passport-facebook').Strategy;
const GoogleStrategy= require("passport-google-oauth").OAuth2Strategy;
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

passport.use(new FbStrategy(
  {
    clientID: process.env.FB_APP_ID,
    clientSecret:process.env.FB_APP_SECRET,
    callbackURL:'/auth/facebook/callback'
  },
  (accessToken, refreshToken, profile, done)=>{
      // console.log('');
      // console.log('FACEBOOK PROFILE ------------------------');
      // console.log(profile);
      // console.log('');

      User.findOne(
        {facebookId: profile.id},
        (err,foundUser) => {
          if(err){
            done(err);
            return;
          }
          //if user is already registered, just log them in
          if(foundUser){
            done(null, foundUser);
            return;
          }
          const theUser = new User({
            facebookId: profile.id,
            name: profile.displayName
          });
          theUser.save((err)=> {
            if (err){
              done(err);
              return;
            }
            done(null, theUser);
          });
        }
      );
  }
));

passport.use(new GoogleStrategy(
  {
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done)=>{

    // console.log('');
    // console.log('Google PROFILE ------------------------');
    // console.log(profile);
    // console.log('');

    User.findOne(
      {googleID: profile.id},

      (err, foundUser) =>{
        if(err){
          done(err);
          return;
        }

        //if user is already registered, just log them in
        if(foundUser){
          done(null, foundUser);
          return;
        }

        //register the user if they are not registered
        const theUser = new User({
          googleID: profile.id,
          name:profile.displayName
        });

        //if the name is empty save the email
        if(!theUser.name){
          theUser.name = profile.emails[0].value;
        }

        theUser.save((err)=>{
          if(err){
            done(err);
            return;
          }
          //this logs in the newly registered user
          done(null, theUser);
        });
      }
    );
  }
));
// ======================== end of social log ins ============ //


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
