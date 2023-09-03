import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import axios from "axios";

function PlayerLeaderboard({ gameid, refereshTheLeaderboard }) {
	const apiUrl = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/getusersgamestatistics";
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true); // Set the initial loading state to true

	useEffect(() => {
		// Make a POST request to the API passing the gameid
		axios
			.post(apiUrl, { gameid })
			.then((response) => {
				// Sort the players in descending order based on points
				const sortedPlayers = response.data.sort((a, b) => b.usergamepoints - a.usergamepoints);
				setPlayers(sortedPlayers);
				setLoading(false); // Set loading state to false when data is fetched
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setLoading(false); // Set loading state to false if an error occurs
			});
	}, [gameid, refereshTheLeaderboard]); // Empty dependency array ensures the effect runs only once when the component mounts

	if (loading) {
		// Render the loading element while fetching data
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Player Leaderboard
			</Typography>
			<Box display="flex" flexDirection="column">
				{players.map((player, index) => (
					<Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 1 }}>
						<Typography variant="h6" gutterBottom>
							{player.userName}
						</Typography>
						<Typography variant="body1">{player.usergamepoints} points</Typography>
					</Paper>
				))}
			</Box>
		</Box>
	);
}

export default PlayerLeaderboard;
