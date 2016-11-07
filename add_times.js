const Rooms = require('./models/room');
const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/room-finder');

fs.readdir('./data', (err, files) => {
  if (err) {
    return console.log('Could not read files');
  }

  files.forEach(file => {
    const courses = require(`./data/${file}`);

    // courses.forEach(course => {
    //   course.sections.forEach(section => {
    //     if (section.type === 'lecture' || section.type === 'discussion') {
    //       Rooms.findOne({ name: section.location }, (err, found) => {
    //         if (err) { return console.log(err); }
    //
    //         // Split the days string (eg. 'MWF' -> ['M', 'W', 'F'])
    //         const days = section.days.split(/(?=[A-Z])/);
    //
    //         // If room was not found, then create it
    //         if (!found) {
    //           // If section does not include TBA, create the room
    //           if ( !(section.location.includes('TBA')) ) {
    //             Rooms.create({ name: section.location, times: [] }, (err, created) => {
    //               if (err) {
    //                 console.log(err);
    //               } else {
    //                 console.log('Created room ' + created.name);
    //                 days.forEach(day => {
    //                   created.times.push({ day: day, time: section.time });
    //                 });
    //
    //                 created.save();
    //               }
    //             });
    //           }
    //         }
    //         // Else the room was found so just add the new day and time
    //         else {
    //           days.forEach(day => {
    //             found.times.push({ day: day, time: section.time });
    //           });
    //
    //           found.save();
    //         }
    //       });
    //     }
    //   });
    // });

    courses.forEach(course => {
      course.sections.forEach(section => {
        if (section.type === 'lecture' || section.type === 'discussion') {
          Rooms.findOne({ name: section.location }, (err, found) => {
            if (err) { return console.log(err); }

            // Split the days string (eg. 'MWF' -> ['M', 'W', 'F'])
            const days = section.days.split(/(?=[A-Z])/);

            // If room was not found, then log it
            if (!found) {
              console.log(`Not found ${section.location}`);
            }
            // Else the room was found so just add the new day and time
            else {
              days.forEach(day => {
                found.times.push({ day: day, time: section.time });
              });

              found.save();
            }
          });
        }
      });
    });
  });
});

// ANBI.forEach(course => {
//   course.sections.forEach(section => {
//     if(section.type === 'lecture' || section.type === 'discussion') {
//       Rooms.findOne({ name: section.location }, (err, found) => {
//         if(err) { return console.log(err); }
//
//         if(!found) { return console.log(`Not found ${section.location}`); }
//
//         const days = section.days.split(/(?=[A-Z])/);
//
//         days.forEach(day => {
//           found.times.push({ day: day, time: section.time });
//         });
//
//         found.save();
//       });
//     }
//   });
// });
