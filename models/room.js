const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: { type: String, unique: true },
  times: [ { day: String, time: String } ],
  building: { type: Object },
});

module.exports = mongoose.model('room', roomSchema);
