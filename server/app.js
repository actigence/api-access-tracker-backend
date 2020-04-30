const AWS = require('aws-sdk');
const {uuid} = require('uuidv4');

const dynamo = new AWS.DynamoDB.DocumentClient();

const queueUrl = process.env.SQS_NAME;
const tableName = process.env.TABLE_NAME;

exports.logEventConsumer = (event) => {
    console.log("generateUniqueCode method invoked successully: " + JSON.stringify(event));
    console.log("logEventConsumer: Queue URL: " + JSON.stringify(queueUrl));
    console.log("logEventConsumer: tableName: " + JSON.stringify(tableName));

    event.Records
        .forEach(record => {
            const {body} = record;
            if (!body) {
                console.log("Body not found for messageId: " + record.messageId)
                return;
            }

            let logEntry = JSON.parse(body);
            logEntry.dynamo_created_date = new Date().toLocaleString();
            logEntry.id = uuid();

            let params = {
                TableName: tableName,
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

