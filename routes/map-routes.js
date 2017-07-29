const TravelPlan = require('../models/travelPlan-model.js');
const MapLocation = require('../models/map-model.js');
const User = require('../models/user-model.js');

const loggedInApi = require('../lib/loggedInApi');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');

const mapRouter = express.Router();


mapRouter.post('/maplocation',
  (req, res, next) => {
    let location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude]
    };

    // Create new point on the location
      const newPoint = {
        name : req.body.pointName,
        about: req.body.pointAbout,
        location  : location
    };

      newPoint.save((err) => {
       if (err) {
         res.json(err);
         return;
       }
     res.json({
       message: 'New map point is saved successfully.',
       id: newPoint._id
     });
 });
});

  mapRouter.get('/maplocation',
      (req, res, next) => {
    MapLocation.find((error, maplocations) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json(mapLocations);
// res.render('travelplans/map-view.ejs', { maplocations: maplocations });
  });
});

module.exports = mapRouter;
