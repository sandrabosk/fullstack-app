const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment-model.js');

const customPlanSchema = new Schema(
  {
    place: {type: String,
      // required: [true, 'Where?']
    },
    whoIsAttending: [], //should this be an empty array in which we push the users
    startDate: {type: Date, default: new Date()},
    endDate: {type: Date, default: new Date()},
    topic: {type: String},
    description: { type: String },


    customNotes:{ type: String}, // ->  ARE NOTES SEPARATE MODEL SINCE THEY WILL HAVE IT'S
    //OWN NESTED COMPONENT AND USERS SHOULD BE ABLE TO COMMENT INTO IT

    planner: {type: Schema.Types.ObjectId },
    comment: [Comment.schema]

  },
  {
    timestamps: true
  }
);

const CustomPlan = mongoose.model('CustomPlan', customPlanSchema);

module.exports = CustomPlan;
