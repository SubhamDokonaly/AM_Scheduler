let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
//country Schema
let countrySchema = mongoose.Schema({
    countryName: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true
    },
    countryCode: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true
    },
    region: {
        type: String,
        require: true,
        trim: true
    },
    currency: {
        type: String,
        require: true,
        trim: true
    },
    rate: {
        type: String,
        require: true,
        trim: true
    },
    phCode: {
        type: String,
        required: true,
        trim: true
    },
    phNumberFormat: {
        type: String,
        required: true,
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
    timezone:{
        type:String,
        // require:true
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("country", countrySchema); 

