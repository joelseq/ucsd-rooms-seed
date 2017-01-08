# UCSD Rooms Seed

Seeds the Database for [UCSD Rooms](https://github.com/joelseq/ucsd-rooms)

## Instructions to seed DB

Make sure to have a local instance of MongoDB running, then:

1. Create a `data` directory
2. Edit the for loop in `socs.js` to run only 10 times eg. `for (let i = 0; i < 10; i++) {}` if not the operation times out and there will be data loss.
3. Run `node socs.js`
4. Repeat steps 2 and 3 but update the values by 10 each time until 185 files have been written to the data folder
5. Run `node add_rooms.js`
6. Run `node add_times.js`
7. Run `node add_openings.js`
