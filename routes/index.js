const express = require('express');
const router  = express.Router();

/* GET home page. */
// router.get('/', (req, res, next) => {
//
//   console.log('HOME ----------------');
//   console.log('SESSION (from express-session middleware)');
//   console.log(req.session);
//   console.log('\n');
//   console.log('USER (from passport middleware)');
//   console.log(req.user);
//
//
//   // req.flash('successfulSignup');
//   res.render('index', {
//     successMessage:req.flash('success'),
//   });
// });

module.exports = router;
