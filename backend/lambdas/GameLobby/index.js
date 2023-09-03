/**
 * This lamdba function will filter games based on the filter provided by the user.
 */
const axios = require('axios');

const endpoint = 'https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/game-details';

// lambda handler
exports.handler = async (event) => {
    const body = event.body ? JSON.parse(event.body) : event;

    const filter = body.filter;

    const response = await axios.get(endpoint);

    const data = response.data;
    const fetchedGames = data[0];

    // clear games
    const newGames = [];

    // add games
    for (let i = 0; i < fetchedGames.length; i++) {
        const game = fetchedGames[i];
        const gameDetails = game.gameDetails;

        // random number between 1 and 30
        const randomDate1 = Math.floor(Math.random() * 30) + 1;
        const randomDate2 = Math.floor(Math.random() * 30) + 1;

        const startDate = Math.min(randomDate1, randomDate2);
        const endDate = Math.max(randomDate1, randomDate2);

        const formattedGame = {
            id: game.gameId,
            name: gameDetails.gameName,
            category: gameDetails.questions[0].category,
            difficulty: gameDetails.questions[0].difficulty,
            startTime: `2023-7-${startDate} 12:00:00`, endTime: `2023-10-${endDate} 12:00:00`
        };
        newGames.push(formattedGame);
    }

    // filter games
    const filteredGames = filter ? newGames.filter((game) => {
        if (filter.difficulty && filter.difficulty !== 'All' && game.difficulty !== filter.difficulty) {
            return false;
        }

        if (filter.category && filter.category !== 'All' && game.category !== filter.category) {
            return false;
        }

        if (filter.search && filter.search !== "" && !game.name.toLowerCase().includes(filter.search.toLowerCase())) {
            return false;
        }

        if (filter.startDate && filter.startDate && new Date(game.startTime) < filter.startDate) {
            return false;
        }

        if (filter.endDate && filter.endDate && new Date(game.endTime) > filter.endDate) {
            return false;
        }

        return true;
    }) : newGames;


    return {
        statusCode: 200,
        body: JSON.stringify(filteredGames),
    };
};