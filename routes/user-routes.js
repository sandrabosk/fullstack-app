const express      = require('express');
const mongoose = require('mongoose');

const ensure       = require('connect-ensure-login');
const bcrypt       = require('bcrypt');

const User         = require('../models/user-model.js');
const multer     = require('multer');
const upload     = multer({ dest: 'public/images/user-photos' });


const routerThingy = express.Router();

routerThingy.put('/profile/edit',
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {

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
        req.user.firstName = req.body.firstName;
        req.user.lastName = req.body.lastName;
        req.user.email= req.body.email;
        req.user.dob = req.body.dob;
        req.user.gender = req.body.gender;
        req.user.profession = req.body.profession;
        req.user.fav = req.body.fav;

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

          // res.redirect('/profile/edit');
        });
      }
    );
  }
);

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
