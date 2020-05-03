const AWS = require('aws-sdk');
const {uuid} = require('uuidv4');

/**
 * DynamoDB does not allow values to be empty string "", `convertEmptyValues` parameter auto converts empty string to NULL
 * @type {AWS.DynamoDB.DocumentClient}
 */
const dynamo = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

//DynamoDB table name for inbound api request logs storage
const inboundTable = process.env.INBOUND_TABLE_NAME;

//DynamoDB table name for outbound api request logs storage
const outboundTable = process.env.OUTBOUND_TABLE_NAME;

/**
 * This method creates a Lambda function that is used to read values from Inbound SQS and store them to DynamoDB table
 * @param event
 */
exports.inboundRequestQueueConsumer = (event) => {
    event.Records
        .forEach(record => {
            const {body} = record;
            if (!body) {
                console.log("Body not found for messageId: " + record.messageId);
                return;
            }

            let logEntry = JSON.parse(body);
            logEntry.dynamo_created_date = new Date().toLocaleString();
            logEntry.id = uuid();

            let params = {
                TableName: inboundTable,
                Item: logEntry
            };

            let dbPut = (params) => {
                return dynamo.put(params).promise()
            };

            dbPut(params).then((data) => {
                console.log(`PUT ITEM SUCCEEDED WITH response = ${JSON.stringify(data)}`);
            }).catch((err) => {
                console.error(`PUT ITEM FAILED FOR doc = ${JSON.stringify(logEntry)}, WITH ERROR: ${err}`);
            });
        });
};

/**
 * This method creates a Lambda function that is used to read values from Outbound SQS and store them to DynamoDB table
 * @param event
 */
exports.outboundRequestQueueConsumer = (event) => {
    event.Records
        .forEach(record => {
            const {body} = record;
            if (!body) {
                console.log("Body not found for messageId: " + record.messageId);
                return;
            }

            let logEntry = JSON.parse(body);
            logEntry.dynamo_created_date = new Date().toLocaleString();
            logEntry.id = uuid();

            let params = {
                TableName: outboundTable,
                Item: logEntry
            };

            let dbPut = (params) => {
                return dynamo.put(params).promise()
            };

            dbPut(params).then((data) => {
                console.log(`Successfully stored SQS event with id: ${event.messageId}`);
            }).catch((err) => {
                console.error(`Error storing event id : ${event.messageId} with error: ${err}`);
            });
        });
};

