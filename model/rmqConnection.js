const amqp = require('amqplib');
const { createNewJobs } = require('./cron');
const logger = require("./logger")(__filename)


let channel, message

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        channel = await connection.createChannel();
        if (channel) {
            logger.info('RabbitMq connected successfully');

            return channel
        }
    } catch (error) {
       logger.error('Error connecting to RabbitMQ:', error.message);
    }
};


//common Function for RabbitMQ Send Message
const receiveMessage = async (queueName) => {
    try {
        channel = await connectToRabbitMQ()
        if (channel === undefined) {
            logger.error(`Error Receiving message from RMQ`)

            return
        }
        await channel.assertQueue(queueName)
        channel.consume(queueName, async (data) => {
            if (data !== null || data !== undefined) {
                message = data.content.toString();
                message = JSON.parse(message)
                if (message) {
                    logger.info(`Received timezone ${message} from RMQ`)
                    await createNewJobs(message)
                    await channel.ack(data)

                    return
                }
                await channel.ack(data)

                return
            }
        })
    } catch (error) {
        logger.error(`Error reciving message from RMQ ${error.message}`)
    }

};

receiveMessage("timezone")



module.exports = { receiveMessage }
