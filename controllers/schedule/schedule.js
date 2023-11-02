'use strict'
//Imports
const db = require('../../model/mongodb')
const momentTimezone = require('moment-timezone')
const cron = require('cron').CronJob

module.exports = function () {
    let router = {}

    //Add Country City
    router.addScheduleJob = async (req,res) => {
        try {
            let countryData, laneData, scheduleCondition, scheduleData, currentTime,IANATime
            console.log(req.body.iana);
            IANATime = req.body.iana
            new cron(`00 06 16 * * *`, async () => {
                try {
                    countryData = await db.findSingleDocument("country", { timezone: IANATime }, { _id: 1 })
                    laneData = await db.findAndSelect("lane", { country: countryData._id }, { _id: 1 })
                    currentTime = momentTimezone.tz(IANATime).format('YYYY-MM-DDT23:59:00.000+00:00')

                    console.log(`Current time in ${IANATime}: ${currentTime}`)
                    scheduleCondition = {
                        $and: [
                            { "pol": { $in: laneData } },
                            { 'status': 1 },
                            {
                                'bookingCutOff': { $lte: Date(currentTime) },
                            },
                        ],
                    }
                    scheduleData = await db.findAndSelect("schedule", scheduleCondition, { _id: 1 })
                    if (scheduleData && scheduleData.length !== 0) {
                        scheduleData = scheduleData.map(e => e._id)
                        updateScheduleStatus = await db.updateManyDocuments("schedule", { "_id": { $in: scheduleData } }, { status: 2 })
                    }
                    console.log(`Hello ${IANATime}- ${countryData}- ${laneData}`)
                } catch (error) {
                    console.log(error.message)
                }
            }
                ,
                null,
                true,
                `${IANATime}`,
            );
        } catch (error) {
            console.log({ status: 0, response: error.message })
        }
    }

    return router
}
