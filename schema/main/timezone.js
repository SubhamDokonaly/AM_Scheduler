let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
//Lane Schema
let timezoneSchema = new mongoose.Schema({
    timezone: {
        type: String,
        require: true,
        trim: true,
        unique:true
    },

}, { timestamps: true, versionKey: false });

module.exports = timezoneSchema;
