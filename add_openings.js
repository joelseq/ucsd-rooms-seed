const mongoose = require('mongoose');
const Rooms = require('./models/room');
const Openings = require('./models/openings');

mongoose.connect('mongodb://localhost:27017/room-finder');

Rooms.find({}, (err, rooms) => {
  if (err) { console.log(err); }

  rooms.forEach(room => {
    // Get all the times for the respective days
    let mondayTimes = room.times.filter((time) => time.day === 'M');
    let tuesdayTimes = room.times.filter((time) => time.day === 'Tu');
    let wednesdayTimes = room.times.filter((time) => time.day === 'W');
    let thursdayTimes = room.times.filter((time) => time.day === 'Th');
    let fridayTimes = room.times.filter((time) => time.day === 'F');

    // Sort the times in ascending order
    mondayTimes.sort(sortTimes);
    tuesdayTimes.sort(sortTimes);
    wednesdayTimes.sort(sortTimes);
    thursdayTimes.sort(sortTimes);
    fridayTimes.sort(sortTimes);

    // Make the arrays only contain the times
    mondayTimes = mondayTimes.map(day => day.time);
    tuesdayTimes = tuesdayTimes.map(day => day.time);
    wednesdayTimes = wednesdayTimes.map(day => day.time);
    thursdayTimes = thursdayTimes.map(day => day.time);
    fridayTimes = fridayTimes.map(day => day.time);

    // Get all the open times on each day (inverse of times being used)
    const mondayOpenTimes = getOpenTimes(room, 'M', mondayTimes);

    console.log(mondayOpenTimes);
  });
});

function getOpenTimes(room, day, arr) {
  const returnArray = [];

  for(let i = 0; i < arr.length; i++) {
    // Split the start and end times
    const times = arr[i].split('-');
    // Get the int values of start and end times
    const startTime = getTimeInNumber(times[0]);
    const endTime = getTimeInNumber(times[1]);

    // If it is the first element, the start time is 0
    if (i === 0) {
      returnArray.push({ room, day, start: 0, end: startTime });
    } else {
      // Get the end time of the previous element in the array
      const previousTimes = arr[i - 1].split('-');
      const previousEndTime = getTimeInNumber(previousTimes[1]);

      returnArray.push({ room, day, start: previousEndTime, end: startTime });
    }
    // This is an if as well because sometimes there is only one element (corner case)
    // If it is the last element, the end time is 1440
    if (i === arr.length-1) {
      returnArray.push({ room, day, start: endTime, end: 1440 });
    }
  }

  return returnArray;
}

/**
 * sortTimes - function to sort strings based on their time value
 */
function sortTimes(a, b) {
  let firstTime = a.time.split('-')[0];
  let secondTime = b.time.split('-')[0];

  // If the first is AM and the second is PM, then return -1
  if (firstTime.includes('a') && secondTime.includes('p')) {
    return -1;
  }
  // If the first is PM and the second is AM, then return 1
  else if (firstTime.includes('p') && secondTime.includes('a')) {
    return 1;
  }
  // Else they are both AM or PM
  else {
    firstTimeHour = parseInt(firstTime.split(':')[0]);
    secondTimeHour = parseInt(secondTime.split(':')[0]);

    // If the hour is 12 change it to 0
    firstTimeHour  = firstTimeHour  === 12 ? 0 : firstTimeHour;
    secondTimeHour = secondTimeHour === 12 ? 0 : secondTimeHour;

    if (firstTimeHour < secondTimeHour) {
      return -1;
    } else {
      return 1;
    }
  }
}


function getTimeInNumber(time) {
  let timeSplit = time.split(':');
  let hours = parseInt(timeSplit[0]);
  let minutes = timeSplit[1];

  // If the hour is 12 change it to 0
  hours = hours === 12 ? 0 : hours;

  if (minutes.includes('a')) {
    minutes = parseInt(minutes.split('a')[0]);

    return (hours * 60) + minutes;
  } else {
    minutes = parseInt(minutes.split('p')[0]);

    return 720 + ( hours * 60) + minutes;
  }
}
