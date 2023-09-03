import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GameOver = () => {
	const navigate = useNavigate();
	const updateTeamScoreAfterGame = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/updatestatisticsaftergame";
	const updateUserScoreAfterGame = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/updateuserstatisticsaftergame";
	const { state } = useLocation();
	const { gameId, startTime, teamId } = state;

	useEffect(() => {
		const updateScore = async () => {
			await axios
				.post(updateTeamScoreAfterGame, { gameId: gameId, startTime: startTime, teamId: teamId })
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		updateScore();
	}, [gameId, startTime, teamId]);

	useEffect(() => {
		const updateUserScore = async () => {
			await axios
				.post(updateUserScoreAfterGame, { gameId: gameId, startTime: startTime, teamId: teamId, userId: localStorage.getItem("userId") })
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		updateUserScore();
	}, [gameId, startTime, teamId]);

	return (
		<Container>
			<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
				<Typography variant="h4" component="h1">
					Game Over
				</Typography>
				<Button variant="contained" color="primary" style={{ marginTop: "20px" }} onClick={() => navigate("/")}>
					Go to Home
				</Button>
			</Box>
		</Container>
	);
};

export default GameOver;
