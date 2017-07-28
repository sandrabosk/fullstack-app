const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String },
    lastName: {type: String },
    email: { type: String} ,
    encryptedPassword: { type: String,
    required: true
    },
    image: {type: String,
      default: ''
    },
    dob: {type: Date, default: new Date()},
    gender: { type: String },
    profession: { type: String },
    fav: { type: String },
    about: { type: String },
    myTravelPlans:[],
    myCustomPlans:[]
  },
  {
    timestamps:true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
