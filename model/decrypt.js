//Decrypt the Data
const logger = require("../model/logger")(__filename)
const common = require("../model/common")

const decryptData = (req, res, next) => {
    let data = { status: 0, response: "invalid Request" }, reqData

    try {
        reqData = req.body

        if (Object.keys(reqData).length === 0 || reqData.data.length === 0) {
            res.send(data)

            return
        }
        reqData = common.decryptAPI(reqData.data[0])
        req.body = reqData

        next()
    } catch (error) {
        logger.error(`Error in decryptData : ${error.message}`)
        res.send(error.message)
    }
}

module.exports={decryptData}