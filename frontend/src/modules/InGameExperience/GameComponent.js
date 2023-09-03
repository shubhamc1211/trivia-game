import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import TeamLeaderboard from "./TeamLeaderboard";
import PlayerLeaderboard from "./PlayerLeaderboard";
import ChatBox from "../ChatBox";
const Timer = ({ endTime, onEnded }) => {
	const [now, setNow] = useState(Date.now());

	// Convert the ISO 8601 endTime string to a timestamp
	const endTimeTimestamp = new Date(endTime).getTime();

	useEffect(() => {
		const interval = setInterval(() => {
			setNow(Date.now());
		}, 1000);

		if (now > endTimeTimestamp) {
			clearInterval(interval);
			onEnded();
		}

		return () => {
			clearInterval(interval);
		};
	}, [now, endTimeTimestamp, onEnded]);

	const timeRemaining = Math.max(endTimeTimestamp - now, 0);
	const secondsRemaining = Math.round(timeRemaining / 1000);

	return <div>{secondsRemaining} seconds remaining</div>;
};
export default function GameComponent() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const gameId = searchParams.get("gameId");
	const teamId = searchParams.get("teamId");
	const userId = localStorage.getItem("userId");

	const getQuestions = `https://n8osia8tpb.execute-api.us-east-1.amazonaws.com/Test`;
	// const getQuestions = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/getgame";
	const updateScore = `https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/updatestatistics`;
	const [currentQuestion, setCurrentQuestion] = useState(null);
	const [selectedOption, setSelectedOption] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isTimeUp, setIsTimeUp] = useState(false);
	const [noOptionSelected, setNoOptionSelected] = useState(false);
	const [refereshTheLeaderboard, setRefereshTheLeaderboard] = useState(false);

	const handleOptionChange = (event) => {
		console.log(event.target.value);
		setSelectedOption(event.target.value);
		setNoOptionSelected(false);
	};

	const handleSubmit = async () => {
		if (!selectedOption) {
			setNoOptionSelected(true);
			return;
		}
		setIsSubmitted(true);
		if (selectedOption === currentQuestion.answer) {
			console.log("Correct answer!");
			await axios
				.post(updateScore, { userId: userId, gameId: gameId })
				.then((response) => {
					console.log(response.data);
					setRefereshTheLeaderboard(!refereshTheLeaderboard);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const loadQuestion = async () => {
		await axios
			.post(getQuestions, { gameId: gameId })
			.then((response) => {
				const data = JSON.parse(response.data.body);
				setCurrentQuestion(data);
				setIsSubmitted(false);
				setIsTimeUp(false);
				setSelectedOption("");
				setRefereshTheLeaderboard(!refereshTheLeaderboard);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const timeUp = () => {
		console.log("Time up!");
		setIsTimeUp(true);
		if (currentQuestion.isLastQuestion) {
			console.log("Game over!");
			navigate("/gameover", { state: { gameId: gameId, startTime: currentQuestion.startTime, teamId: teamId } });
			return;
		} else {
			setTimeout(() => {
				console.log("Calling load question from timeUp");
				loadQuestion();
			}, 10000);
		}
	};

	useEffect(() => {
		console.log("useEffect");
		loadQuestion();
	}, []);

	if (!currentQuestion) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<div style={{ display: "flex", justifyContent: "space-around" }}>
			<TeamLeaderboard gameid={gameId} refereshTheLeaderboard={refereshTheLeaderboard} />

			{(currentQuestion.message === "Game has ended." || currentQuestion.message === "Game has not started yet.") && (
				<Typography variant="h4">{currentQuestion.message}</Typography>
			)}

			{currentQuestion.message !== "Game has ended." && currentQuestion.message !== "Game has not started yet." && (
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
					<Timer endTime={currentQuestion.questionEndTime} onEnded={timeUp} />
					<Typography variant="h5">{currentQuestion.question}</Typography>
					<FormControl component="fieldset">
						<RadioGroup aria-label="quiz" name="quiz" value={selectedOption} onChange={handleOptionChange}>
							{currentQuestion?.options?.map((option) => (
								<FormControlLabel key={option} value={option} control={<Radio />} label={option} disabled={isSubmitted} />
							))}
						</RadioGroup>
						{noOptionSelected && <Typography color="error">Please select an option!</Typography>}
					</FormControl>
					{isSubmitted && (
						<Typography variant="h5" color={isTimeUp ? (selectedOption === currentQuestion.answer ? "green" : "error") : "black"}>
							You selected: {selectedOption}
						</Typography>
					)}
					{isTimeUp && (
						<>
							<Typography variant="h5">Correct answer: {currentQuestion.answer}</Typography>
							<Typography variant="h5">Explanation: {currentQuestion.explanation}</Typography>
						</>
					)}
					<Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitted || isTimeUp}>
						Submit
					</Button>
				</Box>
			)}
			<PlayerLeaderboard gameid={gameId} refereshTheLeaderboard={refereshTheLeaderboard} />
			<ChatBox gameId={gameId} teamId={teamId} />
		</div>
	);
}
