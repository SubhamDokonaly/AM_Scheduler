"use strict";
/** Dependency Injection */
const express = require("express"), // $ npm install express
    bodyParser = require("body-parser"), // $ npm install body-parser
    mongoose = require("mongoose"), // $ npm install mongoose
    CONFIG = require("./config/config"), // Injecting Our Configuration
    morgan = require('morgan'),
    fs = require('fs'),
    path = require("path"); // Node In-Build Module
const CONFIGJSON = require('./config/config.json')
const cors = require("cors")
require("./model/cron")
const app = express(); // Initializing ExpressJS
const server = require("http").createServer(app);
app.set('trust proxy', 1) // trust first proxy

app.use(cors({
    credentials: true,
    origin:"*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Origin", "X-Requested-with", "Content-Type", "Accept", "Authorization"],
}))

/** MongoDB Connection */
let options = {
    keepAlive: true,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(CONFIG.DB_URL, options);
mongoose.connection.on("error", (error) => console.error("Error in MongoDb connection: " + error));
mongoose.connection.on("reconnected", () => console.log("Trying to reconnect!"));
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected!"));
mongoose.connection.on("connected", () => {
    /** Middleware Configuration */
    app.set("etag", false)
    app.use(bodyParser.urlencoded({ limit: "100mb", extended: true })) // Parse application/x-www-form-urlencoded
    app.use(bodyParser.json({ limit: "100mb", strict: true })) // bodyParser - Initializing/Configuration

    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {

            res.send({ response: "invalid JSON input" }) // Handling JSON parsing error
        } else {

            next(err); // Forwarding other errors to the next middleware
        }
    });
    // app.use("/fileuploads", express.static(path.join(__dirname, "/fileuploads"), { etag: false }))

    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

    // setup the logger
    app.use(morgan(
        function (tokens, req, res) {

            if (tokens.method(req, res) == 'POST') {
                return [
                    tokens.method(req, res),
                    tokens.url(req, res),
                    tokens.status(req, res),
                    tokens.res(req, res, 'content-length'), '-',
                    JSON.stringify(req.body), '-',
                    tokens['response-time'](req, res), 'ms',
                    new Date().toJSON()
                ].join(' ')
            }
            else {
                return [
                    tokens.method(req, res),
                    tokens.url(req, res),
                    tokens.status(req, res),
                    tokens.res(req, res, 'content-length'), '-',
                    tokens['response-time'](req, res), 'ms',
                    new Date().toJSON()
                ].join(' ')
            }

        }, { stream: accessLogStream }));

    require("./routes/schedule/schedule")(app);
    /** HTTP Server Instance */
    try {
        server.listen(CONFIG.PORT, () => {
            console.log("Server turned on with", CONFIG.ENV, "mode on port", CONFIG.PORT);
        });
    } catch (ex) {
        console.log("TCL: ex", ex)
    }
    /** /HTTP Server Instance */
});

