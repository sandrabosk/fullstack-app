const express = require('express');
const mongoose = require('mongoose');
const ensure = require('connect-ensure-login');
const path = require('path');
const loggedInApi = require('../lib/loggedInApi');


const User = require('../models/user-model.js');
const Comment = require('../models/comment-model.js');



const TravelPlan = require('../models/travelPlan-model.js');

const router = express.Router();

// ================ drugo ======================== //

router.post('/api/travelplans',
  loggedInApi,
  (req, res, next)=>{
    const theTravelPlan = new TravelPlan ({
          planOwner: req.user,
          country:req.body.country,
          city: req.body.city,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          tourAttractions:req.body.tourAttractions,
          accomodation: {
            address: req.body.address,
            expense: req.body.expense
          },
          transportation: req.body.transportation,
          tripPlanner: req.user._id,
          travelNotes:req.body.travelNotes
        });


        //saving the plan
      theTravelPlan.save((err)=>{
        if(err){
          res.json(err);
          return;
        }

        // adding the plan to the users myTravelplans array
        req.user.myTravelPlans.push(theTravelPlan);

          req.user.save((err)=>{
            if (err){
            res.send(err);
            return;
          }

          res.json({
            message: 'Your travel plan was saved successfully.',
            id: theTravelPlan._id
          });
          });

        });
  }
);

// ==================== prvo =====================
router.get('/api/travelplans',
  loggedInApi,
  (req, res, next)=>{
    TravelPlan.find(
      {planOwner: req.user._id},
      (err, travelPlansList) => {
        if(err){
          res.json(err);
          return;
        }
        res.json(travelPlansList);
      }
    );
  }
);

// ============ /:id =================
// ============ edit =================

router.get('/api/travelplans/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }
    const travelplanId = req.params.id;
    TravelPlan.findById(travelplanId, (err, travelplan) => {
        if (err) {
          res.json(err);
          return;
        }
        res.json(travelplan);

  });
});

router.post('/travelplans/:id/edit', (req, res, next) => {
    const travelplanId = req.params.id;
    const travelplanChanges = {
      country:         req.body.country,
      city:            req.body.city,
      startDate:       req.body.startDate,
      endDate:         req.body.endDate,
      tourAttractions: req.body.tourAttractions,
      accomodation:    req.body.accomodation,
      transportation:  req.body.transportation,
      tripPlanner:     req.user._id,
      travelNotes:     req.body.travelNotes
        };

    TravelPlan.findByIdAndUpdate(travelplanId, travelplanChanges, (err, travelplan) => {
        if (err){
          res.json(err);
          return;
        }
        res.json(travelplan);
        });
});
// ============ end edit =================


// ============ adding the friends ============




// ============ adding the travelplans to myPlan's array ============

router.post('/api/travelplans/:id/addfriends', (req, res, next) => {

console.log(req.body);
  const travelplanId = req.params.id;
  const id = req.body.id;

  // const frName = req.body.firstName;
  // const frLastName = req.body.lastName;
  User.findById(id, (err, foundUser) => {

  // User.findOne({firstName:frName } && {lastName: frLastName }, (err, foundUser) => {
    if(err){
      res.json(err);
      return;
    }
console.log('=============================');
    console.log('FOUND USER',foundUser);
    // console.log('friends name: ', frName);
    // console.log('foundUser name: ', foundUser[0].firstName);
    console.log('=======================');

if (foundUser) {
  console.log('foundUser.id', foundUser._id);

  TravelPlan.findById(travelplanId, (err, travelplan)=>{

    travelplan.travelFriends.push(foundUser._id);
    foundUser.myTravelPlans.push(travelplan._id);

    travelplan.save((err)=>{
      if(err){
          res.json(err);
          return;
        }
        foundUser.save((err)=>{
                if(err){
                    res.json(err);
                    return;
                  }
                  res.json({
                    message: 'You just added a friend.',
                    // name: foundUser.firstName
                  });
              });

    });
  });

  // if (foundUser) {
    // TravelPlan.findById(travelplanId, (err, travelplan)=>{
    //
    //   console.log('==========================================');
    //   console.log(foundUser.myPlans);
    //
    //
    //     });
    //   }

      return;
    }
  });
});
// ============ end adding the friends ============

// ============ adding the comments on notes ======

router.get('/travelplans/:id/addnotes',(req, res, next)=>{
  const travelplanId = req.params.id;
  TravelPlan.findById(travelplanId,(err, theTravelPlan)=>{
    if (err) {
      res.json(err);
      return;
    }
    if (theTravelPlan) {

      let isUserThere = false;
      // console.log('the travel plan', theTravelPlan);

      theTravelPlan.travelFriends.forEach((oneFriend) => {

        console.log('===========================================');
        console.log('oneFriend._id', oneFriend._id);
        console.log('req.user._id', req.user._id);
        console.log('===========================================');

        if (oneFriend._id.toString() === req.user._id.toString()) {
          isUserThere = true;
        }
      });

          res.render('travelplans/notes-view.ejs',{
            isUserFriend: isUserThere,
            travelplan: theTravelPlan,
            user: req.user
          });
          }
      });


});

router.post('/travelplans/:id/notes',(req, res, next)=>{
  const travelplanId = req.params.id;
  TravelPlan.findById(travelplanId, (err, theTravelPlan)=>{
    if (err) {
      res.json(err);
      return;
    }
    if (theTravelPlan) {
      const newComment = new Comment({
        commenter: req.user,
        content:req.body.content
      });
      theTravelPlan.comment.push(newComment);
      theTravelPlan.save((err)=>{
        if (err) {
            res.json(err);
            return;
        }
        res.json(theTravelPlan);
      });
    }
  });
});

// ============ end adding the comments on notes ======


// ============== delete ========================

router.delete('/api/travelplans/:id', (req, res, next)=>{

const travelplanId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  TravelPlan.remove({_id: travelplanId}, (err, theTravelPlan)=>{
    if(err){
      res.json(err);
      return;
    }
    res.json({
    message: 'Travel plan has been removed.',
    id: theTravelPlan._id
    });
  });
  // find all users who have theTravelPlan (that is travelplanId) in
  // their myTravelPlans array and remove it too.
});
// ============== end delete ========================
// ============== search ===========================

router.get('/travelplans/:id/notes/search', (req, res, next)=>{
  const travelplanId = req.params.id;
  TravelPlan.findById(travelplanId, (err, theTravelPlan)=>{
    if (err) {
      res.json(err);
      return;
    }
    if (theTravelPlan) {
      const searchTerm = req.query.searchTerm;

      console.log('~~~~~~~~~~~~~~~');
      console.log(searchTerm);
      const searchRegex = new RegExp(searchTerm, 'i');
      Comment.find(
        { 'content': searchRegex },
        (err, searchResults)=>{
          if (err) {
            res.json(err);
            return;
          }
          res.render('travelplans/travelplan-search-view.ejs',{
            comments:searchResults,
            travelplan: theTravelPlan
          });
        }
      );
    }
  });
});


// ============== end search ========================
// ============ find all users ====================
router.get('/api/users', (req, res, next)=>{

  User.find((err, usersList)=>{
    if(err){
      res.json(err);
      return;
    }
    res.json(usersList);
  });
});

// ============ end of find all users =============





module.exports = router;
