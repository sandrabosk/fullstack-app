const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MapSchema = new Schema ({
  name: {type: String},
  address: {type: String},
  addCity: { type: String },
  addCountry: { type: String },
  about: { type: String },
  planId: { type: Schema.Types.ObjectId }
});

MapSchema.index({ location: '2dsphere' });

const MapThings =  mongoose.model('mapthings', MapSchema);

module.exports = MapThings;
