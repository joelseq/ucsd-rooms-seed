const mongoose = require('mongoose');
const Rooms = require('./models/room');
const Openings = require('./models/openings');

mongoose.connect('mongodb://localhost:27017/room-finder');

mongoose.Promise = global.Promise;

Rooms.find({}, (err, rooms) => {
  if (err) { console.log(err); }

  rooms.forEach(room => {
    filterOpenTimesByDay('M', room);
    filterOpenTimesByDay('Tu', room);
    filterOpenTimesByDay('W', room);
    filterOpenTimesByDay('Th', room);
    filterOpenTimesByDay('F', room);
  });
});

/**
 * filterOpenTimesByDay - saves all openings for a specific day to the DB.
 * @param  {String} day - the string of the day
 * @param {Room} room - the room for which to filter
 */
function filterOpenTimesByDay(day, room) {
  let timesForDay = room.times.filter(time => time.day === day);

  timesForDay.sort(sortTimes);

  timesForDay = timesForDay.map(day => day.time);

  openTimesForDay = getOpenTimes(room, day, timesForDay);

  saveTimes(openTimesForDay);
}

/**
 * getOpenTimes - finds all the times that the room is unused on the specified
 * day
 * @param  {Room} room [the room to find the open times of]
 * @param  {String} day  [the day to find open times on]
 * @param  {[String]} arr  [Array of string times for when the room is used]
 * @return {[Openings]}      [Returns an array of openings]
 */
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
    // If it is the last element, the end time is 1439
    if (i === arr.length-1) {
      returnArray.push({ room, day, start: endTime, end: 1439 });
    }
  }

  return returnArray;
}

/**
 * sortTimes - comparator function to sort strings based on their time value
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

/**
 * getTimeInNumber - converts a string time into an int
 * @param  {String} time [the time string to convert]
 * @return {Number}      [the int value of the time in mins (0 - 1440)]
 */
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

/**
 * saveTimes - saves all the open times to the DB
 * @param  {[Openings]} openTimesArr [The array of open times]
 */
function saveTimes(openTimesArr) {
  openTimesArr.forEach(openTime => {
    Openings.create(openTime, (err, saved) => {
      if (err) {
        console.log(err);
      }
    });
  });
}
