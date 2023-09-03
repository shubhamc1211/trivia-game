/**
 * This lambda function is to provide team scores for the lexbot based on userId and teamName.
 * 
 * @Author Rahul Saliya
 */
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "teams";
// const tableName = "DummyTeamsNew";

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
 * This function is to check if the userId is present in the team members and add the team to the teamScores array.
 * 
 * @param {*} team 
 * @param {*} userId 
 * @param {*} teamScores 
 */
function checkAndAdd(team, userId, teamScores) {
    const members = team.members;
    members.forEach(member => {
        if (!userId || member.userId === userId) {
            teamScores.push({
                id: team.id,
                score: team.totalpoints,
                teamName: team.teamName
            });
        }
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
        return {
            statusCode: 400,
            body: JSON.stringify("Missing teamName.")
        };
    }

    const ExpressionAttributeValuesCapitalized = {
        ":teamName": capitalWords(teamName),
    };

    const ExpressionAttributeValuesLowercase = {
        ":teamName": teamName.toLowerCase(),
    };

    // query params
    const queryParams = {
        TableName: tableName,
        IndexName: "teamName-index",
        KeyConditionExpression: "teamName = :teamName",
        ExpressionAttributeValues: ExpressionAttributeValuesLowercase
    };


    // To query the table based on the teamName
    // Learned from: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
    const teamsLowerCase = (await dynamoDb.query(queryParams).promise()).Items;

    queryParams.ExpressionAttributeValues = ExpressionAttributeValuesCapitalized;

    // To query the table based on the teamName
    // Learned from: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
    const teamsCapitalized = (await dynamoDb.query(queryParams).promise()).Items;

    const teamScores = [];

    teamsLowerCase.forEach(team => {
        checkAndAdd(team, userId, teamScores);
    });

    teamsCapitalized.forEach(team => {
        checkAndAdd(team, userId, teamScores);
    });

    const response = {
        statusCode: 200,
        body: JSON.stringify(teamScores)
    };

    return response;
};