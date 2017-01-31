const Rooms = require('./models/room');
const mongoose = require('mongoose');
const fs = require('fs');
const buildingList = require('./buildings.json').reduce((a, v) => { 
  a[v["code"]] = v;
  return a;
}, {});

mongoose.connect('mongodb://localhost:27017/room-finder');

mongoose.Promise = global.Promise;

fs.readdir('./data', (err, files) => {
  if (err) {
    return console.log('Could not read files');
  }

  files.forEach(file => {
    const courses = require(`./data/${file}`);

    courses.forEach(course => {
      course.sections.forEach(section => {
        if (section.type === 'lecture' || section.type === 'discussion') {
          Rooms.findOne({ name: section.location }, (err, found) => {
            if (err) { return console.log(err); }
            // If room was not found, then create it
            if (!found) {
              // If section does not include TBA, create the room
              if ( !(section.location.includes('TBA')) ) {
                let building = section.location.split(" ")[0];
                let roomInfo = { 
                  name: section.location, 
                  times: [], 
                  building: {} 
                };

                if (building in buildingList) {
                  roomInfo["building"] = buildingList[building]
                }
                Rooms.create(roomInfo, (err, created) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Created room ' + created.name);
                  }
                });
              }
            }
          });
        }
      });
    });
  });
});
