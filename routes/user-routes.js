const express     = require('express');
const mongoose    = require('mongoose');

const ensure      = require('connect-ensure-login');
const bcrypt      = require('bcrypt');

const User        = require('../models/user-model.js');
const multer      = require('multer');
const upload      = multer({ dest: 'public/images/user-photos' });
const loggedInApi = require('../lib/loggedInApi');

const routerThingy = express.Router();

routerThingy.post('/api/profile/edit',
  loggedInApi,
  (req, res, next) => {
    console.log('dkhakhdkjahkjdhakjhd');
    console.log(req.body);
    console.log('-------------------');

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const currentPassword = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;

    User.findOne(
      { email: email },
      { email: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

      // add updates from form
      if (req.body.firstName) {
        req.user.firstName = req.body.firstName;
      }
      if (req.body.lastName) {
        req.user.lastName = req.body.lastName;
      }
      if (req.body.email) {
        req.user.email= req.body.email;
      }
      if (req.body.dob) {
        req.user.dob = req.body.dob;
      }
      if (req.body.profession) {
        req.user.profession = req.body.profession;
      }

      if (req.body.fav) {
        req.user.fav = req.body.fav;
      }
      if (req.body.about) {
        req.user.about = req.body.about;
      }
        // req.user.gender = req.body.gender;

        if (currentPassword && newPassword && bcrypt.compareSync(currentPassword, req.user.encryptedPassword)) {
          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(newPassword, salt);
          req.user.encryptedPassword = hashPass;
        }
        // save updates!
        req.user.save((err) => {
          if (err) {
              res.status(500).json({ message: 'Something went wrong.' });
              return;
            }
      res.status(200).json(req.user);
        });
      }
    );
  }
);

routerThingy.post('/api/uploadphoto',loggedInApi, upload.single('file'), function(req, res){
  console.log('user', req.user);

    console.log('req file', req.file);

   if (req.file !== undefined) {
   User.findById(req.user._id, (err, theUser) =>{
       if (err) {
         return res.send(err);
       }
       theUser.image = "https://whats-the-plan.herokuapp.com/images/user-photos/"+req.file.filename;

      //  theUser.image = `${BASE_URL}/images/user-photos/`+req.file.filename;

       theUser.save((err) => {
         if (err) {
             res.status(500).json({ message: 'Something went wrong.' });
             return;
           }
          return res.json({
            message:'Photo update went fine.',
            user: theUser
          });
       });
     });
   }
});


routerThingy.get('/users', (req, res, next)=>{
  if(req.user && req.user.role === 'admin'){

  User.find((err, usersList)=>{
    if(err){
      next(err);
      return;
    }

    res.render('user/users-list-view.ejs',{
      users:usersList,
      successMessage: req.flash('success')
    });
  });
}

  else {
    next();
  }
});


module.exports = routerThingy;
