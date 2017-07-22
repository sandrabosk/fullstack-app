const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment-model.js');


const travelPlanSchema = new Schema(
  {
    country: {type: String, required: [true, 'Which country did you travel to?']},
    city: {type: String},
    startDate: {type: Date, default: new Date()},
    endDate: {type: Date, default: new Date()},

    tourAttractions: [], // -> MY IDEA IS TO MAKE IT AN EMPTY ARRAY AND TO PUSH
    //DESTINATIONS INTO THAT ARRAY WHEN WE PUT MARKERS ON THE MAP? IS THAT DOABLE?

    accomodation: {
      address: { type: String },
      expense: { type: Number }
    },
    transportation: { type: String },

    travelFriends:[{type: String}],
    planOwner: {type: Schema.Types.ObjectId },

    travelNotes:{ type: String},  // -> ARE NOTES SEPARATE MODEL SINCE THEY WILL HAVE IT'S
    //OWN NESTED COMPONENT AND USERS SHOULD BE ABLE TO COMMENT INTO IT

    comment: [Comment.schema]
  },
  {
    timestamps: true
  }
);

const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

module.exports = TravelPlan;
