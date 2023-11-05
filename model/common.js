const db = require('./mongodb')
const momentTimezone = require('moment-timezone')
const logger = require("./logger")(__filename)


let checkValidTz, filterValidTz, timezoneDb, checkIfvalid, validTimezones = [], getData, key, myObject

checkValidTz = (timezone) => {
    timezoneDb = momentTimezone.tz.names();
    checkIfvalid = timezoneDb.includes(timezone);
    return checkIfvalid
}

filterValidTz = async (timezoneList) => {

    timezoneDb = momentTimezone.tz.names();
    timezoneList.forEach((tz) => {
        key = "timezone"
        checkIfvalid = timezoneDb.includes(tz);
        if (checkIfvalid === true) {
            myObject = { [key]: tz };
            validTimezones.push(myObject)
        }
        else {
            logger.error(`Invalid timezone found ${tz}`)
        }
    })

    await db.deleteManyDocument("timezone")

    getData = await db.insertManyDocuments("timezone", validTimezones)

    return getData
}


module.exports = { checkValidTz, filterValidTz }