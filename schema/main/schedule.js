let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
//Schedule Schema
let scheduleSchema = mongoose.Schema({
    scheduleId: {
        type: String,
        unique: true,
        require: true,
        trim: true,
    },
    pol: {
        type: ObjectId,
        require: true,
        trim: true,
        ref: "lane"
    },
    pod: {
        type: ObjectId,
        require: true,
        trim: true,
        ref: "lane"
    },
    container: {
        type: String,
        require: true,
        trim: true,
    },
    volume: {
        type: Number,
        require: true
    },
    weight: {
        type: Number,
        require: true
    },
    vessel: {
        type: String,
        require: true,
        trim: true,
    },
    voyage: {
        type: String,
        require: true,
        trim: true
    },
    etd: {
        type: Date,
        require: true,
        trim: true
    },
    eta: {
        type: Date,
        require: true,
        trim: true
    },
    bookingCutOff: {
        type: Date,
        require: true,
        trim: true
    },
    originCfsCutOff: {
        type: Date,
        require: true,
        trim: true
    },
    destinationCfsCutOff: {
        type: Date,
        require: true,
        trim: true
    },
    originCfsName: {
        type: ObjectId,
        trim: true,
        require: true,
    },
    originCfsBranch: {
        type: ObjectId,
        trim: true,
        require: true,
    },
    destinationCfsName: {
        type: ObjectId,
        trim: true,
        require: true,
    },
    destinationCfsBranch: {
        type: ObjectId,
        trim: true,
        require: true,
    },
    originCfsClosingtime: {
        type: String,
        trim: true,
        require: true
    },
    destinationCfsClosingtime: {
        type: String,
        trim: true,
        require: true
    },
    containerNo: {
        type: String,
        trim: true,
    },
    sealNo: {
        type: String,
        trim: true,
    },
    mblNo: {
        type: String,
        trim: true,
    },
    mblDate: {
        type: Date,
        trim: true
    },
    aetd: {
        type: Date,
        trim: true
    },
    aeta: {
        type: Date,
        trim: true
    },
    serviceName: {
        type: String,
        require: true
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
        type: Number,            //1: active, 2: inactive, 3: manually deactive 
        default: 1
    },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("schedule", scheduleSchema);

