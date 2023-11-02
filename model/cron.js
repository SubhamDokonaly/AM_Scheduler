'use strict'
//Imports
const db = require('./mongodb')
const logger = require("./logger")(__filename)
const Country = require("../schema/main/country")
// const moment = require('moment');
const momentTimezone = require('moment-timezone')
const cron = require('cron').CronJob

const scheduleJob = async () => {
    try {
        let countryUniqueTimezone, countryData, laneData, scheduleCondition, scheduleData, currentTime, updateScheduleStatus,
            scheduleIds, schedule_id
        countryUniqueTimezone = await db.getDistinctValues("country", "timezone")
        //  console.log(countryUniqueTimezone)

        countryUniqueTimezone.map((UTCTime) => {
            new cron(`00 40 11 * * *`, async () => {
                try {
                    countryData = await db.findSingleDocument("country", { timezone: UTCTime }, { _id: 1 })
                    laneData = await db.findAndSelect("lane", { country: countryData._id }, { _id: 1 })
                    currentTime = momentTimezone.tz(UTCTime).format('YYYY-MM-DDT23:59:00.000+00:00')
                    console.log(`Current time in ${UTCTime}: ${currentTime}`)
                    scheduleCondition = {
                        $and: [
                            { "pol": { $in: laneData } },
                            { 'status': 1 },
                            {
                                'bookingCutOff': { $lte: Date(currentTime) },
                            },
                        ],
                    }
                    scheduleData = await db.findAndSelect("schedule", scheduleCondition, { _id: 1, scheduleId: 1 })
                    if (scheduleData && scheduleData.length !== 0) {
                        schedule_id = scheduleData.map(e => e._id)
                        scheduleIds = scheduleData.map(e => e.scheduleId)
                        updateScheduleStatus = await db.updateManyDocuments("schedule", { "_id": { $in: schedule_id } }, { status: 2 })
                        if (updateScheduleStatus.modifiedCount !== 0 && updateScheduleStatus.matchedCount !== 0) {
                            logger.info(`Schedule Expaired For - ${UTCTime} -to ScheduleIds - ${scheduleIds}`)

                            return;
                        }
                    }
                    logger.info(`Schedule Expaired For - ${UTCTime} -No schedule Found`)
                } catch (error) {
                    logger.error(`Error in cron model -scheduleJob : ${error.message}`)
                }
            },
                null,
                true,
                `${UTCTime}`,
            );
        })
    } catch (error) {
        console.log({ status: 0, response: error.message })
    }
}

scheduleJob()


const createNewJob = async () => {
    try {
        let countryUniqueTimezone, countryData, laneData, scheduleCondition, scheduleData, currentTime, updateScheduleStatus,
            scheduleIds, schedule_id
        countryUniqueTimezone = await db.getDistinctValues("country", "timezone")
        //  console.log(countryUniqueTimezone)

        countryUniqueTimezone.map((UTCTime) => {
            new cron(`00 40 11 * * *`, async () => {
                try {
                    countryData = await db.findSingleDocument("country", { timezone: UTCTime }, { _id: 1 })
                    laneData = await db.findAndSelect("lane", { country: countryData._id }, { _id: 1 })
                    currentTime = momentTimezone.tz(UTCTime).format('YYYY-MM-DDT23:59:00.000+00:00')
                    console.log(`Current time in ${UTCTime}: ${currentTime}`)
                    scheduleCondition = {
                        $and: [
                            { "pol": { $in: laneData } },
                            { 'status': 1 },
                            {
                                'bookingCutOff': { $lte: Date(currentTime) },
                            },
                        ],
                    }
                    scheduleData = await db.findAndSelect("schedule", scheduleCondition, { _id: 1, scheduleId: 1 })
                    if (scheduleData && scheduleData.length !== 0) {
                        schedule_id = scheduleData.map(e => e._id)
                        scheduleIds = scheduleData.map(e => e.scheduleId)
                        updateScheduleStatus = await db.updateManyDocuments("schedule", { "_id": { $in: schedule_id } }, { status: 2 })
                        if (updateScheduleStatus.modifiedCount !== 0 && updateScheduleStatus.matchedCount !== 0) {
                            logger.info(`Schedule Expaired For - ${UTCTime} -to ScheduleIds - ${scheduleIds}`)

                            return;
                        }
                    }
                    logger.info(`Schedule Expaired For - ${UTCTime} -No schedule Found`)
                } catch (error) {
                    logger.error(`Error in cron model -scheduleJob : ${error.message}`)
                }
            },
                null,
                true,
                `${UTCTime}`,
            );
        })
    } catch (error) {
        console.log({ status: 0, response: error.message })
    }
}

// const changeStream =  Country.watch()

// const checkForChanges = () => {
//     try {
//         new cron(`*/01 * * * *`, async () => {
//             try {
//                 let newDocument;

//                 console.log("hello");
//                 console.log(changeStream._events.change());
//                 changeStream.on('change', (change) => {
//                     console.log(change);
//                     if (change.operationType === 'insert') {
//                         newDocument = change.fullDocument;
//                         console.log('New data inserted:', newDocument);
//                     }
//                 });
//             } catch (error) {
//                 logger.error(`Error in cron model -scheduleJob : ${error.message}`)
//             }
//         },
//             null,
//             true,
//             "Asia/Kolkata",
//         );
//     } catch (error) {
//         console.log({ status: 0, response: error.message }) 
//     }
    
// }

new cron(`*/01 * * * *`, async () => {
                try {
                    const changeStream = Country.watch();
  
                    changeStream.on('change', (change) => {
                      if (change.operationType === 'insert') {
                        const newDocument = change.fullDocument;
                        console.log('New data inserted:', newDocument);
                      }
                    });
                } catch (error) {
                    logger.error(`Error in cron model -scheduleJob : ${error.message}`)
                }
            },
                null,
                true,
                "Asia/Kolkata",
            );



module.exports = {
    scheduleJob
}
