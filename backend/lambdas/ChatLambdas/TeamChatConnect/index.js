/**
 * This lambda function will to store new connection in the ChatConnections table.
 * 
 * @Author Rahul Saliya
 */
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

// create table if not exist
async function createTableIfNotExist() {
    const params = {
        TableName: 'ChatConnections',
        KeySchema: [
            { AttributeName: 'connectionId', KeyType: 'HASH' },
        ],
        AttributeDefinitions: [
            { AttributeName: 'connectionId', AttributeType: 'S' },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
        await dynamodb.createTable(params).promise();
        await createIndexIfNotExist();
        console.log('Created table');
    }
    catch (error) {
        if (error.code === 'ResourceInUseException') {
            console.log('Table already exists');
        }
        else {
            console.log('Error creating table:', error.message);
        }
    }
}
// create index for gameId, teamId
async function createIndexIfNotExist() {
    const params = {
        TableName: 'ChatConnections',
        AttributeDefinitions: [
            { AttributeName: 'gameId', AttributeType: 'S' },
            { AttributeName: 'teamId', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: 'gameId-teamId-index',
                    KeySchema: [
                        { AttributeName: 'gameId', KeyType: 'HASH' },
                        { AttributeName: 'teamId', KeyType: 'RANGE' },
                    ],
                    Projection: {
                        ProjectionType: 'ALL',
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 2,
                        WriteCapacityUnits: 2,
                    },
                },
            },
        ],
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateTable-property 
        await dynamodb.updateTable(params).promise();
        console.log('Created index');
    }
    catch (error) {
        if (error.code === 'ResourceInUseException') {
            console.log('Index already exists');
        }
        else {
            console.log('Error creating index:', error.message);
        }
    }
}

// insert connection in the table
async function insertConnection(connectionId, teamId, gameId) {
    const params = {
        TableName: 'ChatConnections',
        Item: {
            connectionId: { S: connectionId },
            teamId: { S: teamId },
            gameId: { S: gameId },
        },
    };

    try {
        // Learned from: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
        await dynamodb.putItem(params).promise();
        console.log('Inserted item');
    }
    catch (error) {
        console.log('Error inserting item:', error.message);
    }

}

// lambda handler
exports.handler = async (event) => {
    const teamId = event.queryStringParameters.teamId;
    const gameId = event.queryStringParameters.gameId;
    const connectionId = event.requestContext.connectionId;

    await createTableIfNotExist();

    await insertConnection(connectionId, teamId, gameId);

    return {
        statusCode: 200,
        body: 'Connected',
    };
};