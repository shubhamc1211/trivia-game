/**
 * This file is to get score of a team.
 * 
 * @Author Rahul Saliya
 */
const lexResponse = require('./lexResponse');
const axios = require('axios');

// const endpoint = 'https://p6wrwfvxp5.execute-api.us-east-1.amazonaws.com/team-score';
const endpoint = 'https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/getteamsocre';

/**
 *  This function is to get score of a team.
 * @param {*} event 
 * @returns response
 */
module.exports = async function getScore(event) {
    const intent = event.interpretations[0].intent;
    const intentName = intent.name;
    const slots = intent.slots;
    const userId = event.sessionId;

    const teamName = slots.TeamName;

    const dialogAction = {};

    if (!teamName) {
        dialogAction.type = 'ElicitSlot';
        dialogAction.slotToElicit = 'TeamName';
        dialogAction.intentName = intentName;
        dialogAction.slots = slots;
    } else {
        dialogAction.type = 'Close';
    }

    const intentResponse = {
        name: intentName
    };

    if (!teamName) {
        intentResponse.confirmationState = 'None';
        intentResponse.state = 'InProgress';
    } else {
        intentResponse.confirmationState = 'Confirmed';
        intentResponse.state = 'Fulfilled';
    }

    const messages = [];

    if (!teamName) {
        messages.push({
            contentType: 'PlainText',
            content: 'Please provide the name of the team.'
        });
    } else {
        const teamNameValue = teamName.value.originalValue;

        const response = await axios.post(endpoint, {
            teamName: teamNameValue,
            userId: userId
        });

        const teams = response.data.body ? JSON.parse(response.data.body) : response.data;

        const length = teams.length;

        if (length === 0) {
            messages.push({
                contentType: 'PlainText',
                content: `Sorry but you are not associated with any team named <b>${teamNameValue}</b>.`
            });
        } else {
            var scoreString = length === 1 ? 'Score' : 'All scores';
            var teamString = length === 1 ? 'team' : 'teams';
            var isAreString = length === 1 ? 'is' : 'are';
            var message = `${scoreString} for your ${teamString} named <b>${teamNameValue}</b> ${isAreString}: <br/>`;
            for (let i = 0; i < length; i++) {
                message += `${i + 1}. ${teams[i].score.toFixed(2)} points<br/>`;
            }
            messages.push({
                contentType: 'PlainText',
                content: message
            });
        }
    }

    return lexResponse(dialogAction, intentResponse, messages);
}