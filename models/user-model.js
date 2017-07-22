const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  //1st argument -> fields of documents
  {
    firstName: { type: String,
          // required: [true, 'Please insert your first name.']
        },
    lastName: {type: String,
          // required: [true, 'Please insert your last name.']
    },
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
    myCustomPlans:[],

    //login with facebook users
    facebookID: { type: String },

    //login with google users
    googleID: { type: String }

  },

  //2nd arg -> additional options
  {
    //adds createdAt & updatedAt
    timestamps:true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
