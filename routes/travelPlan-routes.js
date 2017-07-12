const express = require('express');
const mongoose = require('mongoose');
const ensure = require('connect-ensure-login');
const path = require('path');

const TravelPlan = require('../models/travelPlan-model.js');

const router = express.Router();

//creating travel plans
router.get('/travelplans/new',
//we need to be logged in to create rooms
  ensure.ensureLoggedIn('/login'),

  (req, res, next)=>{  //we know this user is logged in thats why we dont need id
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
          // next(err);
          return;
        }
        res.json({
          message: 'Your travel plan was saved successfully.',
          id: theTravelPlan._id
        });
        // req.flash('success', 'Your travel plan was saved successfully.');
        // res.redirect('/travelplans');
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

router.get('/travelplans/:id', (req, res, next) => {
    const travelplanId = req.params.id;
    TravelPlan.findById(travelplanId, (err, travelplan) => {
        if (err) {
          res.json(err);
          return;
        }
        // res.json(travelplan);

    res.render('travelplans/edit-travelplan-view.ejs', { travelplan: travelplan });
  });
});

router.post('/travelplans/:id/edit', (req, res, next) => {
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


module.exports = router;
