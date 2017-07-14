const express = require('express');
const mongoose = require('mongoose');
const ensure = require('connect-ensure-login');
const path = require('path');

const User = require('../models/user-model.js');


const CustomPlan = require('../models/customPlan-model.js');

const router = express.Router();

//creating custom plans
router.get('/customplans/new',
//we need to be logged in to create plans
  ensure.ensureLoggedIn('/login'),

  (req, res, next)=>{
    res.render('customplans/new-customplan-view.ejs');
  }
);
// ================ drugo ======================== //

router.get('/customplans', (req, res, next) => {
  CustomPlan.find((err, customPlansList) =>{
    if(err){
      res.json(err);
      return;
    }
    res.json(customPlansList);
  });
});

router.post('/customplans',
  // ensure.ensureLoggedIn('/login'),
  (req, res, next)=>{
    const theCustomPlan = new CustomPlan ({
          place:req.body.place,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          topic:req.body.topic,
          description: req.body.description,
          customNotes:req.body.customNotes,
          planner: req.user._id
        });
      theCustomPlan.save((err)=>{
        if(err){
          res.json(err);
          return;
        }
        res.json({
          message: 'Your plan was saved successfully.',
          id: theCustomPlan._id
        });
      });
  }
);
// ==================== prvo =====================
router.get('customplans',
  // ensure.ensureLoggedIn(),
  (req, res, next)=>{
    CustomPlan.find(
      {owner: req.user._id},
      (err, customPlansList) => {
        if(err){
          // next(err);
          res.json(err);
          return;
        }
        res.json(customPlansList);

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

router.get('/customplans/:id', (req, res, next) => {
    const customplanId = req.params.id;
    CustomPlan.findById(customplanId, (err, customplan) => {
        if (err) {
          res.json(err);
          return;
        }
        res.json(customplan);

    // res.render('customplans/edit-customplan-view.ejs', { customplan: customplan });
  });
});

router.post('/customplans/:id/edit', (req, res, next) => {
  console.log('=================');

    const customplanId = req.params.id;
    const customplanChanges = {
      place: req.body.place,
      startDate:   req.body.startDate,
      endDate:     req.body.endDate,
      topic:       req.body.topic,
      description: req.body.description,
      customNotes: req.body.customNotes,
      planner:     req.user._id
        };

    CustomPlan.findByIdAndUpdate(customplanId, customplanChanges, (err, customplan) => {
        if (err){
          res.json(err);
          return;
        }
        res.json(customplan);
        });
});
// ============ end edit =================

// ============ adding the friends ============

router.get('/customplans/:id/addpeople', (req, res, next) => {
  const customplanId = req.params.id;
  CustomPlan.findById(customplanId, (err, customplan) => {
    if (err) {
      res.json(err);
      return;
    }
    res.render('customplans/addPeople.ejs', { customplan: customplan });

  });
});


router.post('/customplans/:id/addpeople', (req, res, next) => {
  const customplanId = req.params.id;
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
  CustomPlan.findById(customplanId, (err, theCustomplan)=>{
    theCustomplan.whoIsAttending.push(foundUser);
    theCustomplan.save((err)=>{
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
        message: 'You just added a person.',
        name: foundUser[0].firstName
      });
      return;
    }
  });
});
// ============ end adding the friends ============




// ============== delete ========================

router.delete('/customplans/:id/delete', (req, res, next)=>{
  const customplanId = req.params.id;
  CustomPlan.findByIdAndRemove(customplanId, (err, theCustomPlan)=>{
    if(err){
      res.json(err);
      // next(err);
      return;
    }
    res.json({
    message: 'Plan has been removed.',
    id: theCustomPlan._id
    });

    // res.redirect('/trips');
  });
});
// ============== end delete ========================


module.exports = router;
