const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment-model.js');

const customPlanSchema = new Schema(
  {
    place: { type: String },
    whoIsAttending: [],
    startDate: { type: Date, default: new Date()},
    endDate: { type: Date, default: new Date()},
    topic: { type: String},
    description: { type: String },


    customNotes:{ type: String},

    planner: {type: Schema.Types.ObjectId },
    comment: [Comment.schema]

  },
  {
    timestamps: true
  }
);

const CustomPlan = mongoose.model('CustomPlan', customPlanSchema);

module.exports = CustomPlan;
