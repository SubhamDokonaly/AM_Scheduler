let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
//Lane Schema
let jobLogSchema = new mongoose.Schema({
    scheduleId: {
        type: String,
        require: true,
        trim: true,
        ref: "country"
    },
    timezone: {
        type: String,
        require: true,
        trim: true,
    },
    cutOffDate: {
        type: Date,
    },
    startsAt: {
        type: Date,
    },
    endsAt: {
        type: Date,
    },
    currentTimeIN:{
        type:Date
    },
    currentTimeOC:{
        type:Date
    }
}, { timestamps: true, versionKey: false });

module.exports = jobLogSchema;

