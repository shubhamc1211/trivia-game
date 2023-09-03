/**
 * This lambda function is to provide team scores for the lexbot based on userId and teamName.
 * 
 * @Author Rahul Saliya
 */
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "DummyTeams";

/**
 * This function is to capitalize the first letter of each word in a string.
 * 
 * @param {*} str 
 * @returns 
 */
function capitalWords(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/**
 * This function is to get score of a team based on teamName and userId.
 * 
 * @param {*} teamName
 * 
 * @returns response
 * */
exports.handler = async (event) => {
    const body = event.body ? JSON.parse(event.body) : event;
    const teamName = body.teamName;
    const userId = body.userId;

    if (!teamName) {
        const response = {
            statusCode: 400,
            body: JSON.stringify("Missing teamName")
        };

        return response;
    }

    // query params
    const queryParams = {
        TableName: tableName,
        IndexName: "teamName-index",
        KeyConditionExpression: "teamName = :teamName",
        ExpressionAttributeValues: {
            ":teamName": capitalWords(teamName)
        }
    };

    // To query the table based on the teamName
    // Learned from: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
    const teams = await dynamoDb.query(queryParams).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(teams.Items)
    };

    return response;
};