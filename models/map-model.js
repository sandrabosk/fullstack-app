const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MapSchema = new Schema ({
  name: {type: String},
  address: {type: String},
  about: { type: String },
  planId: { type: Schema.Types.ObjectId }
});

MapSchema.index({ location: '2dsphere' });

const MapThings =  mongoose.model('MapThings', MapSchema);

module.exports = MapThings;
