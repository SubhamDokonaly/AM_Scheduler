let mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
//Lane SchemaClone
let laneSchemaClone = mongoose.Schema({
    originalId: {
        type: ObjectId,
        required: true,
        ref: "lane"
    },
    actionType: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    data: {
        type: Object,
        required: true,
        trim: true
    },
    status: {
        type: Number
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("laneClone", laneSchemaClone); 

