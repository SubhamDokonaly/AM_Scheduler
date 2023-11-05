let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
//Lane Schema
let jobLogSchema = new mongoose.Schema({
    scheduleInfo: {
        type: Array,
        require: true,
        trim: true,
    },
    timezone: {
        type: String,
        require: true,
        trim: true,
    },
    startsAt: {
        type: String,
    },
    endsAt: {
        type: String,
    },
    currentTimeIN: {
        type: String
    },
    currentTimeOC: {
        type: String
    }
}, { timestamps: true, versionKey: false });

module.exports = jobLogSchema;

