const { default: mongoose } = require("mongoose");
const CONFIG = require("./config");


/** MongoDB Connection */
let options = {
    keepAlive: true,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

let mongoose1 = mongoose.createConnection(CONFIG.DB_URL, options)

let mongoose2 = mongoose.createConnection(CONFIG.DB_URL2, options)

module.exports = function (){
    let dataModels  = {}

    dataModels.countryModel = mongoose1.model('country',require("../schema/main/country"));

    dataModels.laneModel = mongoose1.model('lane',require("../schema/main/lane"));
    
    dataModels.scheduleModel = mongoose1.model("schedule",require("../schema/main/schedule"))
    
    dataModels.timezoneModel = mongoose2.model("timezone",require("../schema/main/timezone"))
    
    dataModels.jobLogsModel = mongoose2.model("jobLogs",require("../schema/main/jobLogs"))

    return dataModels
}




