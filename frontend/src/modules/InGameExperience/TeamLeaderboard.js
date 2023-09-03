import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import axios from "axios";

function TeamLeaderboard({ gameid, refereshTheLeaderboard }) {
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true); // Set the initial loading state to true

	useEffect(() => {
		// Define the API endpoint and the gameid
		const apiUrl = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/getteamstatistics";

		// Make a POST request to the API passing the gameid
		axios
			.post(apiUrl, { gameid })
			.then((response) => {
				// Sort the teams in descending order based on points
				const sortedTeams = response.data.teams.map(JSON.parse).sort((a, b) => b.teamgamepoints - a.teamgamepoints);
				setTeams(sortedTeams);
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
				Team Leaderboard
			</Typography>
			<Box display="flex" flexDirection="column">
				{teams.map((team, index) => (
					<Paper key={index} elevation={3} sx={{ padding: 2, marginBottom: 1 }}>
						<Typography variant="h6" gutterBottom>
							{team.teamName}
						</Typography>
						<Typography variant="body1">{team.teamgamepoints} points</Typography>
					</Paper>
				))}
			</Box>
		</Box>
	);
}

export default TeamLeaderboard;
