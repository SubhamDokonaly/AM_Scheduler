//Imports
const logger = require("../../model/logger")(__filename)
const { decryptData } = require('../../model/decrypt')

module.exports = (app) => {
    try {

        //User Controllers
        const schedule = require("../../controllers/schedule/schedule.js")()

        //User APIs
        app.post('/scheduler/createNewJob', schedule.addScheduleJob )
    } catch (e) {
        logger.error(`Error in user route: ${e.message}`)
    }
};