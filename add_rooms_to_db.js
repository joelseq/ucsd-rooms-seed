const roomsToAdd = require('./rooms.json');
const Rooms = require('./models/room');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/room-finder');

roomsToAdd.forEach(room => {
  Rooms.create({ name: room, times: [] }, (err, created) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Successfully added ' + room);
    }
  });
});
