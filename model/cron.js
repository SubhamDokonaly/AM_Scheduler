'use strict'
//Imports
const db = require('./mongodb')
const logger = require("./logger")(__filename)
// const moment = require('moment');
const momentTimezone = require('moment-timezone')
const cron = require('cron').CronJob
const amqp = require('amqplib');
const queueName = "timezone"

const connectToRabbitMQ = async () => {
    try {
        let countryData, laneData, scheduleCondition, scheduleData, currentTime, updateScheduleStatus,
            scheduleIds, schedule_id, connection, channel, UTCTime, checkIfvalid

        connection = await amqp.connect('amqp://localhost:5672');
        channel = await connection.createChannel();
        if (channel) {
            console.log('Connected to RabbitMQ');
        }
        // Start consuming messages from the queue
        await channel.assertQueue(queueName);
        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                console.log(msg);
                UTCTime = msg.content.toString();
                UTCTime = JSON.parse(UTCTime)


                const validTimezones = momentTimezone.tz.names();

                checkIfvalid = validTimezones.includes(UTCTime);

               if(checkIfvalid === false){
                console.log(`Invalid timezone added ${UTCTime}`);
                channel.ack(msg);

                return
               }
                console.log(UTCTime);
                new cron(`00 19 09 * * *`, async () => {
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
                console.log('Received message:', UTCTime);
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};
connectToRabbitMQ();

const scheduleJob = async () => {
    try {
        let countryUniqueTimezone, countryData, laneData, scheduleCondition, scheduleData, currentTime, updateScheduleStatus,
            scheduleIds, schedule_id
        countryUniqueTimezone = await db.getDistinctValues("country", "timezone")

        let dataTz = countryUniqueTimezone.map((tz) => {
            const key = "timezone"
            const myObject = { [key]: tz };
            return myObject
        })

        if (countryUniqueTimezone.length !== 0) {
            await db.deleteManyDocument("timezone")
            let getData = await db.insertManyDocuments("timezone", dataTz)
            console.log(getData);
        }

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



module.exports = {
    scheduleJob
}
