const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment-model.js');
const MapThings = require('./map-model.js');



const travelPlanSchema = new Schema(
  {
    name: { type: String },
    country: { type: String },
    city: { type: String },
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date, default: new Date() },

    tourAttractions: [{type: Schema.Types.ObjectId, ref: "MapThings"}],

    accomodation: {
      acAddress: { type: String },
      expense: { type: Number }
    },
    transportation: { type: String },

    travelFriends:[{type: Schema.Types.ObjectId, ref: "User"}],
    planOwner: { type: Schema.Types.ObjectId },

    travelNotes:{ type: String},

    comment: [Comment.schema]
  },
  {
    timestamps: true
  }
);


const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);
travelPlanSchema.pre('remove', function(callback){
  //Remove all the docs that refers
  this.model('User').remove({travelplanId: this._id}, callback);
});
module.exports = TravelPlan;
