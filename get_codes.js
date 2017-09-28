const axios = require('axios');
const jsonfile = require('jsonfile');

const QUARTER = 'FA17';

axios
  .get(`https://act.ucsd.edu/scheduleOfClasses/subject-list.json?selectedTerm=${QUARTER}`)
  .then((response) => {
    const codes = response.data.map(elem => elem.code);

    jsonfile.writeFile('./codes.json', codes, console.log);
  })
  .catch(console.log);