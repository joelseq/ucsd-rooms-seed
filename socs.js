const socsjs = require('socsjs');
const jsonfile = require('jsonfile');
const fs = require('fs');
const departments = require('./codes.json');

console.log('Number of departments:', departments.length);

const QUARTER = 'FA16';
const TIMEOUT = 10000;

const total = departments.length;
let counter = 0;
let data = [];

for(let i = 180; i < total; i++) {
  socsjs.searchDepartment(QUARTER, departments[i], TIMEOUT, false)
    .then(result => {
      jsonfile.writeFile(`./data/${departments[i]}.json`, result, (err) => {
        if(err) {
          console.log(err);
        }
      });
    })
    .catch(err => {
      console.log(`Something went wrong for ${departments[i]}`);
    });
}

// departments.forEach(dept => {
//   socsjs.searchDepartment(QUARTER, dept, TIMEOUT, false)
//     .then(result => {
//       jsonfile.writeFile(`./data/${dept}.json`, result, (err) => {
//         if(err) {
//           console.log(err);
//         }
//       });
//     })
//     .catch(err => {
//       console.log('Something went wrong for ' + dept);
//     })
// });
