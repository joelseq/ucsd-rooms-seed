const socsjs = require('socsjs');
const jsonfile = require('jsonfile');
const fs = require('fs');
const departments = require('./codes.json');

console.log('Number of departments:', departments.length);

const QUARTER = 'FA17';
const TIMEOUT = 10000;

for (let i = 160; i < departments.length; i++) {
  socsjs.searchDepartment(QUARTER, departments[i], TIMEOUT, false)
    .then(result => {
      jsonfile.writeFile(`./data/${departments[i]}.json`, result, (err) => {
        if (err) {
          console.log(err);
        }
      });
    })
    .catch(err => {
      console.log(`Something went wrong for ${departments[i]}`);
    });
}
