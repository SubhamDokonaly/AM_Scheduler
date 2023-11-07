const { default: mongoose } = require("mongoose");
const CONFIG = require("../config/config");


/** MongoDB Connection */
let options = {
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

let mongoose1 = mongoose.createConnection(CONFIG.DB_URL, options)

let mongoose2 = mongoose.createConnection(CONFIG.DB_URL2, options)

module.exports = function (){
    let dataModels  = {}

    dataModels.countryModel = mongoose1.model('country',require("../schema/apiDb/country"));

    dataModels.laneModel = mongoose1.model('lane',require("../schema/apiDb/lane"));
    
    dataModels.scheduleModel = mongoose1.model("schedule",require("../schema/apiDb/schedule"))
    
    dataModels.timezoneModel = mongoose2.model("timezone",require("../schema/schedulerDb/timezone"))
    
    dataModels.jobLogsModel = mongoose2.model("jobLogs",require("../schema/schedulerDb/jobLogs"))

    return dataModels
}




