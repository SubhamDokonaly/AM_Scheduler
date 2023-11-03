let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
//Lane Schema
let laneSchema = new mongoose.Schema({
    portName: {
        type: String,
        require: true,
        trim: true,
        lowercase: true
    },
    portCode: {
        type: String,
        require: true,
        trim: true,
        lowercase: true
    },
    bookingCode: {
        type: String,                  //type: 1 : gateway, 2 : destination
        require: true
    },
    type: {
        type: Number,                  //type: 1 : gateway, 2 : destination
        enum: [1, 2],
        require: true
    },
    country: {
        type: ObjectId,
        require: true,
        trim: true,
        ref: "country"
    },
    fee: {
        type: Number,
        default: 0,
        require: true,
        trim: true
    },
    createdBy: {
        type: ObjectId,
        require: true,
        ref: "user"
    },
    systemInfo: {
        type: Object
    },
    status: {
        type: Number,
        default: 1
    },
}, { timestamps: true, versionKey: false });

module.exports = laneSchema; 

