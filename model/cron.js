'use strict'
//Imports
const db = require('./mongodb')
const logger = require("./logger")(__filename)
// const moment = require('moment');
const momentTimezone = require('moment-timezone')
const moment = require("moment")
const cron = require('cron').CronJob
const { filterValidTz, checkValidTz } = require('./common')



const createNewJobs = async (timezone) => {
    try {
        let countryData, laneData, scheduleCondition, scheduleData, currentTime, updateScheduleStatus,
            scheduleIds, schedule_id, getJobInfo, data

        data = { status: 0, response: "Invalid request" }


        if (timezone === undefined || timezone === null) {

            return
        }


        if (checkValidTz(timezone) === false) {
            logger.error(`Invalid timezone added ${timezone}`);

            return
        }

        getJobInfo = new cron(`00 19 19 * * *`, async () => {
            try {
                countryData = await db.findSingleDocument("country", { timezone: timezone }, { _id: 1 })
                laneData = await db.findAndSelect("lane", { country: countryData._id }, { _id: 1 })
                currentTime = momentTimezone.tz(timezone).format('YYYY-MM-DDT23:59:00.000+00:00')
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
                    scheduleInfo = scheduleData.map(e => [{ "ScheduleId": e.scheduleId, "bookingCutOff": e.bookingCutOff }])

                    updateScheduleStatus = await db.updateManyDocuments("schedule", { "_id": { $in: schedule_id } }, { status: 2 })
                    if (updateScheduleStatus.modifiedCount !== 0 && updateScheduleStatus.matchedCount !== 0) {
                        endsAt = moment().tz("Asia/Kolkata").format("dddd, MMMM Do YYYY, h:mm:ss a")
                        data = {
                            scheduleInfo: scheduleInfo,
                            timezone: timezone,
                            startsAt: startsAt,
                            endsAt: endsAt,
                            currentTimeIN: startsAt,
                            currentTimeOC: currentTimeOC
                        }
                        await db.insertSingleDocument("joblog", data)
                        logger.info(`Schedule Expired For - ${timezone} -to ScheduleIds - ${scheduleIds}`)

                        return;
                    }
                }

                logger.info(`Schedule Expired For - ${timezone} -No schedule Found`)
            } catch (error) {
                logger.error(`Error in cron model -scheduleJob : ${error.message}`)
            }
        },
            null,
            true,
            `${timezone}`,
        );
        if (getJobInfo) {
            logger.info(`Job successfully added for ${getJobInfo.cronTime.zone} `)

            return
        }

        logger.error(data)
    } catch (error) {
        logger.error('Error creating new timezone:', error.message);
    }
};



const scheduleJob = async () => {
    try {
        let countryData, laneData, scheduleCondition, scheduleData, currentTime, data, updateScheduleStatus,
            scheduleIds, schedule_id, validTimezones, timezoneList, startsAt, endsAt, scheduleInfo, currentTimeOC


        timezoneList = await db.getDistinctValues("country", "timezone")
        validTimezones = await filterValidTz(timezoneList)

        if (validTimezones.length !== 0) {
            validTimezones.map((IANA) => {

                logger.info(`Job successfully added for ${IANA.timezone} `)
                new cron(`00 11 19 * * *`, async () => {
                    try {
                        startsAt = moment().tz("Asia/Kolkata").format("dddd, MMMM Do YYYY, h:mm:ss a")
                        currentTimeOC = momentTimezone.tz(IANA.timezone).format("dddd, MMMM Do YYYY, h:mm:ss a")
                        countryData = await db.findSingleDocument("country", { timezone: IANA.timezone }, { _id: 1 })
                        laneData = await db.findAndSelect("lane", { country: countryData._id }, { _id: 1 })
                        currentTime = momentTimezone.tz(IANA.timezone).format('YYYY-MM-DDT23:59:00.000+00:00')
                        scheduleCondition = {
                            $and: [
                                { "pol": { $in: laneData } },
                                { 'status': 1 },
                                {
                                    'bookingCutOff': { $lte: Date(currentTime) },
                                },
                            ],
                        }
                        scheduleData = await db.findAndSelect("schedule", scheduleCondition, { _id: 1, scheduleId: 1, bookingCutOff: 1 })
                        if (scheduleData && scheduleData.length !== 0) {
                            schedule_id = scheduleData.map(e => e._id)
                            scheduleIds = scheduleData.map(e => e.scheduleId)
                            scheduleInfo = scheduleData.map(e => [{ "ScheduleId": e.scheduleId, "bookingCutOff": e.bookingCutOff }])

                            updateScheduleStatus = await db.updateManyDocuments("schedule", { "_id": { $in: schedule_id } }, { status: 2 })
                            if (updateScheduleStatus.modifiedCount !== 0 && updateScheduleStatus.matchedCount !== 0) {
                                endsAt = moment().tz("Asia/Kolkata").format("dddd, MMMM Do YYYY, h:mm:ss a")
                                data = {
                                    scheduleInfo: scheduleInfo,
                                    timezone: IANA.timezone,
                                    startsAt: startsAt,
                                    endsAt: endsAt,
                                    currentTimeIN: startsAt,
                                    currentTimeOC: currentTimeOC
                                }
                                await db.insertSingleDocument("joblog", data)
                                logger.info(`Schedule Expired For - ${IANA.timezone} -to ScheduleIds - ${scheduleIds}`)

                                return;
                            }
                        }
                        logger.info(`Schedule Expired For - ${IANA.timezone} -No schedule Found`)
                    } catch (error) {
                        logger.error(`Error in cron model -scheduleJob : ${error.message}`)
                    }
                },
                    null,
                    true,
                    `${IANA.timezone}`,
                );
            })

            return
        }
        if (validTimezones.length === 0) {
            logger.info(`No timezone found`)

            return
        }
        logger.error(data)
    } catch (error) {
        logger.error(`Error in cron model -scheduleJob : ${error.message}`)
    }
}

scheduleJob()



module.exports = {
    scheduleJob,
    createNewJobs
}
