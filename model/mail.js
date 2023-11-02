var nodemailer = require('nodemailer')
const CONFIG = require('../config/config.js')

const transporter = nodemailer.createTransport({
  host: CONFIG.SMTP_HOST,
  port: CONFIG.SMTP_PORT,
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  auth: CONFIG.SMTP_AUTH
})

const regestrationTransporter = nodemailer.createTransport({
  host: CONFIG.SMTP_HOST,
  port: CONFIG.SMTP_PORT,
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  auth: CONFIG.REGESTER_AUTH
})

module.exports = { transporter, regestrationTransporter }