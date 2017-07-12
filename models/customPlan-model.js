const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customPlanSchema = new Schema(
  {
    place: {type: String, required: [true, 'Where?']},
    whoIsAttending: {type: String}, //should this be an emptu array in which we push the users
    date: {type: Date, default: new Date()},
    topic: {type: String},
    description: { type: String },


    customNotes:{ type: String}, // ->  ARE NOTES SEPARATE MODEL SINCE THEY WILL HAVE IT'S
    //OWN NESTED COMPONENT AND USERS SHOULD BE ABLE TO COMMENT INTO IT

    planner: {type: Schema.Types.ObjectId },
  },
  {
    timestamps: true
  }
);

const CustomPlan = mongoose.model('CustomPlan', customPlanSchema);

module.exports = CustomPlan;
