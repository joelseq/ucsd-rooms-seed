# UCSD Rooms Seed

Seeds the Database for [UCSD Rooms](https://github.com/joelseq/ucsd-rooms)

## Instructions to seed DB

Make sure to have a local instance of MongoDB running, then:

1. Make sure to set the `QUARTER` variable in `get_codes.js` to the desired quarter (eg. `const QUARTER = 'SP17'`)
2. Run `node get_codes.js`
3. Make sure to set the `QUARTER` variable in `socs.js` to the desired quarter (eg. `const QUARTER = 'SP17'`)
4. Create a `data` directory
5. Edit the for loop in `socs.js` to run only 10 times eg. `for (let i = 0; i < 10; i++) {}` if not the operation times out and there will be data loss.
6. Run `node socs.js`
7. Repeat steps 2 and 3 but update the values by 10 each time until 185 files have been written to the data folder
8. Run `node add_rooms.js`
9. Run `node add_times.js`
10. Run `node add_openings.js`
