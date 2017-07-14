const express = require('express');
const mongoose = require('mongoose');
const ensure = require('connect-ensure-login');
const path = require('path');

const User = require('../models/user-model.js');


const TravelPlan = require('../models/travelPlan-model.js');

const router = express.Router();

//creating travel plans
router.get('/travelplans/new',
//we need to be logged in to create plans
  ensure.ensureLoggedIn('/login'),

  (req, res, next)=>{
    res.render('travelplans/new-travelplan-view.ejs');
  }
);
// ================ drugo ======================== //

router.get('/travelplans', (req, res, next) => {
  TravelPlan.find((err, travelPlansList) =>{
    if(err){
      res.json(err);
      return;
    }
    res.json(travelPlansList);
  });
});

router.post('/travelplans',
  // ensure.ensureLoggedIn('/login'),
  (req, res, next)=>{
    const theTravelPlan = new TravelPlan ({
          country:req.body.country,
          city: req.body.city,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          tourAttractions:req.body.tourAttractions,
          accomodation: req.body.accomodation,
          transportation: req.body.transportation,
          tripPlanner: req.user._id,
          travelNotes:req.body.travelNotes
        });
      theTravelPlan.save((err)=>{
        if(err){
          res.json(err);
          return;
        }
        res.json({
          message: 'Your travel plan was saved successfully.',
          id: theTravelPlan._id
        });
      });
  }
);
// ==================== prvo =====================
router.get('/api/travelplans',
  // ensure.ensureLoggedIn(),
  (req, res, next)=>{
    TravelPlan.find(
      {owner: req.user._id},
      (err, travelPlansList) => {
        if(err){
          // next(err);
          res.json(err);
          return;
        }
        res.json(travelPlansList);

        // res.render('travelplans/travelplans-list-view.ejs',{
        //   travelplans: travelPlansList,
        //   successMessage: req.flash('success')
        // });
      }
    );
  }
);

// ============ /:id =================
// ============ edit =================

router.get('/travelplans/:id', (req, res, next) => {
    const travelplanId = req.params.id;
    TravelPlan.findById(travelplanId, (err, travelplan) => {
        if (err) {
          res.json(err);
          return;
        }
        res.json(travelplan);

    // res.render('travelplans/edit-travelplan-view.ejs', { travelplan: travelplan });
  });
});

router.put('/travelplans/:id/edit', (req, res, next) => {
    const travelplanId = req.params.id;
    const travelplanChanges = {
      country:req.body.country,
      city: req.body.city,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      tourAttractions:req.body.tourAttractions,
      accomodation: req.body.accomodation,
      transportation: req.body.transportation,
      tripPlanner: req.user._id,
      travelNotes:req.body.travelNotes
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

router.get('/travelplans/:id/addfriends', (req, res, next) => {
  const travelplanId = req.params.id;
  TravelPlan.findById(travelplanId, (err, travelplan) => {
    if (err) {
      res.json(err);
      return;
    }
    res.render('travelplans/addingTheTravellers.ejs', { travelplan: travelplan });

  });
});


router.post('/travelplans/:id/addfriends', (req, res, next) => {
  const travelplanId = req.params.id;
  const frName = req.body.frName;
  const frLastName = req.body.frLastName;
  User.find({firstName:frName } && {lastName: frLastName }, (err, foundUser) => {
    if(err){
      res.json(err);
      return;
    }
console.log('=============================');
    console.log(foundUser);
    console.log('friends name: ', frName);
    console.log('foundUser name: ', foundUser[0].firstName);
    console.log('=======================');

if (foundUser) {
  TravelPlan.findById(travelplanId, (err, travelplan)=>{
    travelplan.travelFriends.push(foundUser);
    travelplan.save((err)=>{
      if(err){
          res.json(err);
          return;
        }
    });
  });

//this creates new travelplan
// let newFriend = new TravelPlan();


// newFriend.travelFriends.push(foundUser);

      res.json({
        message: 'You just added a friend.',
        name: foundUser[0].firstName
      });
      return;
    }
  });
});
// ============ end adding the friends ============

// ============== delete ========================

router.delete('/travelplans/:id/delete', (req, res, next)=>{
  const travelplanId = req.params.id;
  TravelPlan.findByIdAndRemove(travelplanId, (err, theTravelPlan)=>{
    if(err){
      res.json(err);
      // next(err);
      return;
    }
    res.json({
    message: 'Travel plan has been removed.',
    id: theTravelPlan._id
    });

    // res.redirect('/trips');
  });
});
// ============== end delete ========================

module.exports = router;
