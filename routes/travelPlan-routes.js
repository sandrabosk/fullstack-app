const express = require('express');
const mongoose = require('mongoose');
const ensure = require('connect-ensure-login');
const path = require('path');
const loggedInApi = require('../lib/loggedInApi');


const User = require('../models/user-model.js');
const Comment = require('../models/comment-model.js');
const MapLocation = require('../models/map-model.js');



const TravelPlan = require('../models/travelPlan-model.js');

const router = express.Router();

// ================ drugo ======================== //

router.post('/api/travelplans',
  loggedInApi,
  (req, res, next)=>{
    const theTravelPlan = new TravelPlan ({
          planOwner: req.user,
          name: req.body.name,
          country:req.body.country,
          city: req.body.city,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          tourAttractions:req.body.tourAttractions,
          accomodation: {
            acAddress: req.body.acAddress,
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
    TravelPlan
      .findById(travelplanId)
      .populate('travelFriends')
      .populate('tourAttractions')
      .exec((err, travelplan) => {
        // console.log('TO from the list ==============', travelplan);
        if (err) {
          res.json(err);
          return;
        }
        res.json(travelplan);
      });
});

router.post('/api/travelplans/:id/edit', (req, res, next) => {
    const travelplanId = req.params.id;
    const travelplanChanges = {
      name:            req.body.name,
      country:         req.body.country,
      city:            req.body.city,
      startDate:       req.body.startDate,
      endDate:         req.body.endDate,
      accomodation: {
        acAddress: req.body.acAddress,
        expense: req.body.expense
      },
      transportation:  req.body.transportation,
      tripPlanner:     req.user._id,
        };

    TravelPlan.findByIdAndUpdate(travelplanId, travelplanChanges,
      (err, travelplan) => {
        if (err){
          res.json(err);
          return;
          }
          res.json(travelplan);
        });
});
// ============ end edit =================
// ============== maps ==================

// router.get('/api/travelplans/:id/maplocations', (req, res, next)=>{
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400)
//        .json({ message: 'Specified id is not valid' });
//     return;
//   }
//   const travelplanId = req.params.id;
//   TravelPlan
//     .findById(travelplanId)
//     .populate('tourAttractions')
//     .exec((err, travelplan)=>{
//       console.log('************travelplan', travelplan);
//       if (err) {
//         next(err);
//         return;
//       }
//       res.json(travelplan);
//     });
// });



    //  (err, travelplan)=>{
    // if (err) {
    //   next(err);
    //   return;
    // }
    // MapLocation.find({travelplanId: travelplanId},(err, maplocations)=>{
    //   if (err) {
    //     next(err);
    //     return;
    //   }
    //   res.json({travelplan: travelplan, maplocations: maplocations});
    // });
    // return;
  // });



router.post('/api/travelplans/:id', (req, res, next)=>{

  const travelplanId = req.params.id;
  console.log('=========== body ========', req.body);

  const newPoint = new MapLocation({
    name: req.body.name,
    address: req.body.address,
    about: req.body.about,
    travelplanId: travelplanId
  });
  newPoint.save((err)=>{
    if (err){
      res.json(err);
      return;
    }
    TravelPlan.findById(travelplanId, (err, travelplan)=>{
      if(err){
        res.json(err);
        return;
      }
      travelplan.tourAttractions.push(newPoint._id);
      console.log('=====````````````````````-----------');
      console.log('travelplan.tourAttractions', travelplan.tourAttractions);
      console.log('newPoint._id', newPoint._id);
      console.log('=====````````````````````-----------');

      travelplan.save((err)=>{
        if(err){
            res.json(err);
            return;
          }
      });
    });
    res.json({
      message:'New point saved',
      new: newPoint
    });
  });
});

// ============== end maps ==================


// ============ adding the friends  and ============

// ============ adding the travelplans to myPlan's array ============

router.post('/api/travelplans/:id/addfriends', (req, res, next) => {

  // console.log(req.body);
  const travelplanId = req.params.id;
  const id = req.body.id;

  User.findById(id, (err, foundUser) => {
    if(err){
      res.json(err);
      return;
    }
    // console.log('=============================');
    // console.log('FOUND USER',foundUser);

  if (foundUser) {
    // console.log('foundUser.id', foundUser._id);

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
                      data: foundUser
                    });
                });
            });
          });

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
const userId = req.user._id;
console.log('travelplanId', travelplanId);
// console.log('userId', userId);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }
TravelPlan.findById(travelplanId, (err, foundPlan)=>{
  if(err){
    res.json(err);
    return;
  }

  // if (foundPlan) {
    User.findById(userId, (err, planOwner)=>{
      console.log("~~~~~~~~~~~~~~************", planOwner.myTravelPlans[0]._id);
      console.log("~~~~~~~~~~~~~~************", planOwner.myTravelPlans[1]._id);

      if(err){
        res.json(err);
        return;
      }

      planOwner.myTravelPlans.forEach((oneTravelplan, index)=>{
        if (oneTravelplan._id === travelplanId) {
          console.log('oneTravelplan', oneTravelplan);
          console.log('travelplanId', travelplanId);
          planOwner.myTravelPlans.splice(index, 1);
        }
      });

        console.log('foundPlan', foundPlan);
        if(err){
          res.json(err);
          return;
        }
        planOwner.save((err)=>{
          if(err){
            res.json(err);
            return;
          }
        });
      });
  // }

});
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
