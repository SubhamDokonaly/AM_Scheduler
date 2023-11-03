var path = require('path')
var fs = require('fs')
require("dotenv").config()
var config = JSON.parse(fs.readFileSync(path.join(__dirname, "/config.json"), 'utf8'))
var CONFIG = {}
CONFIG.ENV = (process.env.NODE_ENV || 'development');
CONFIG.PORT = (process.env.VCAP_APP_PORT || config.port);
CONFIG.DB_URL = 'mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database + '?authSource=admin';
CONFIG.DB_URL2 = 'mongodb://localhost:27017/scheduler';
// CONFIG.DB_URL = "mongodb://localhost:27017"
CONFIG.SECRET_KEY = process.env.SECRET_KEY
CONFIG.API_KEY = process.env.API_KEY
CONFIG.SESSION_KEY = process.env.SESSION_KEY
CONFIG.DB_KEY = process.env.DB_KEY
CONFIG.SITE_URL = process.env.SITE_URL
CONFIG.AZURESTORAGE = process.env.AZURESTORAGE
CONFIG.AZURECONNECTIONSTRING = process.env.AZURECONNECTIONSTRING
CONFIG.SMTP_HOST = process.env.SMTP_HOST
CONFIG.SMTP_PORT = process.env.SMTP_PORT
CONFIG.SMTP_AUTH = { user: process.env.SMTP_AUTH_USER, pass: process.env.SMTP_AUTH_PW }
CONFIG.REGESTER_AUTH = { user: process.env.registrationAuth, pass: process.env.registrationAuthPwd }
// CONFIG.DOMAIN = process.env.DOMAIN 


module.exports = CONFIG
