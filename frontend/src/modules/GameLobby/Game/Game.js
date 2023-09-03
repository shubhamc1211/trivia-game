import React from "react";
import "./Game.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow } from "@mui/material";
import { Timer } from "components";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import axios from "axios";
import APIs from "utils/APIs";

export default function Game() {
	const location = useLocation();
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const gameId = location.pathname.split("/")[2];
	const [teams, setTeams] = React.useState([]);
	const [filteredTeams, setFilteredTeams] = React.useState([]);
	const [searchText, setSearchText] = React.useState("");
	const [game, setGame] = React.useState({
		id: gameId,
		name: "Game",
		category: "Action",
		difficulty: "Easy",
		startTime: "2021-10-10 10:00:00",
		endTime: "2023-7-7 11:00:00",
		description: "This is a game",
		participtants_count: 0,
		code: "123456",
	});

	const userId = localStorage.getItem("userId") ?? "user123"; // TODO: remove this Akshay is using userId in Lambda so ask him
	React.useEffect(() => {
		axios
			.post(APIs.API_GET_USER_TEAMS, {
				userId: userId,
			})
			.then((response) => {
				const teams = JSON.parse(response.data.body).teams;
				const teamArr = [];

				teams?.forEach((team) => {
					const members = team.members;
					members.forEach((member) => {
						if (member.userId === userId && member.role === "admin") {
							teamArr.push(team);
						}
					});
				});

				setTeams(teamArr);
				setFilteredTeams(teamArr);
				console.log(teams);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [userId]);

	React.useEffect(() => {
		const filteredTeams = teams.filter((team) => {
			return team.teamName.toLowerCase().includes(searchText.toLowerCase());
		});
		setFilteredTeams(filteredTeams);
	}, [searchText, teams]);

	React.useEffect(() => {
		axios
			.get(APIs.API_GAME_BY_ID, {
				params: {
					gameId: gameId,
				},
			})
			.then((response) => {
				console.log(response.data);
				const gameData = response.data;
				const gameDetails = gameData.gameDetails;

				// random partificipants count
				const participtants_count = gameDetails.participtants_count ?? Math.floor(Math.random() * 100);
				const description = gameDetails.description ?? "This is a game";
				const startTime = gameDetails.startTime ?? "2021-10-10 10:00:00";
				const endTime = gameDetails.endTime ?? "2023-7-7 11:00:00";

				const newGameData = {
					id: response.data.gameId,
					name: gameDetails.gameName,
					category: gameDetails.questions[0].category,
					difficulty: gameDetails.questions[0].difficulty,
					description: description,
					startTime: startTime,
					endTime: endTime,
					participtants_count: participtants_count,
				};

				setGame(newGameData);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [gameId]);

	const handleClose = () => {
		setOpen(false);
	};

	const onJoinClick = () => {
		// navigate(`/teams`);
		setOpen(true);
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}
				scroll="paper"
				sx={{
					"& .MuiDialog-paper": {
						width: "80%",
						maxWidth: "80%",
						maxHeight: "80%",
						height: "80%",
					},
				}}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">Select your team</DialogTitle>
				<DialogContent
					dividers={true}
					sx={{
						backgroundColor: "#f5f5f5",
					}}
				>
					<TextField
						id="outlined-basic"
						variant="outlined"
						label="Search team"
						fullWidth
						InputProps={{
							sx: {
								marginBottom: "30px",
								backgroundColor: "#ffffff",
							},
						}}
						onChange={(event) => {
							setSearchText(event.target.value);
						}}
					/>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Team Name</TableCell>
									<TableCell>Total Members</TableCell>
									<TableCell>Total Games Played</TableCell>
									<TableCell>Total Wins</TableCell>
									<TableCell>Total Points</TableCell>
									<TableCell>Win/Loss Ratio</TableCell>
									<TableCell>Join</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredTeams && filteredTeams.length > 0 ? (
									filteredTeams.map((team, idx) => {
										return (
											<TableRow key={idx}>
												<TableCell>{team.teamName}</TableCell>
												<TableCell>{team.members.length}</TableCell>
												<TableCell>{team.totalGamesPlayed}</TableCell>
												<TableCell>{team.totalGamesWon}</TableCell>
												<TableCell>{team.totalpoints}</TableCell>
												<TableCell>{(team.totalGamesPlayed > 0 ? team.totalGamesWon / team.totalGamesPlayed : 0).toFixed(2)}</TableCell>
												<TableCell>
													<Button
														variant="contained"
														onClick={() => {
															axios
																.post(APIs.API_JOIN_GAME, {
																	gameId: gameId,
																	teamId: team.id,
																	userId: userId,
																})
																.then((response) => {
																	console.log(response.data);
																	if (response.data.statusCode === 200) navigate(`/ingame?teamId=${team.id}&gameId=${gameId}`);
																})
																.catch((error) => {});
														}}
													>
														Join
													</Button>
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={7} style={{ textAlign: "center" }}>
											No teams found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
			<div className="game-container">
				<div className="game-info-container">
					<Grid
						container
						spacing={2}
						sx={{
							justifyContent: "center",
							padding: "20px",
							textAlign: "center",
						}}
					>
						<Grid item lg={12} xs={12}>
							<h1
								style={{
									fontSize: "50px",
									marginBottom: "0px",
								}}
							>
								{game.name}
							</h1>
						</Grid>

						<Grid item lg={12} xs={12}>
							Time Remaining: <Timer endTime={game.endTime} />
						</Grid>

						<Grid item lg={12} xs={12}>
							<p>{game.description}</p>
						</Grid>
						<Grid item lg={6} xs={6}>
							<h3>Category</h3>
							<p>{game.category}</p>
						</Grid>
						<Grid item lg={6} xs={6}>
							<h3>Difficulty</h3>
							<p>{game.difficulty}</p>
						</Grid>
						<Grid item lg={6} xs={6}>
							<h3>Start Time</h3>
							<p>{game.startTime}</p>
						</Grid>
						<Grid item lg={6} xs={6}>
							<h3>End Time</h3>
							<p>{game.endTime}</p>
						</Grid>
						<Grid item lg={12} xs={12}>
							<h3>Participants</h3>
							<p>{game.participtants_count}</p>
						</Grid>

						<Grid item lg={4} xs={12} />

						<Grid item lg={4} xs={12}>
							{game.code && (
								<TextField
									id="outlined-basic"
									variant="outlined"
									label="Enter game code"
									fullWidth
									InputProps={{
										sx: {
											"& input": {
												textAlign: "center",
											},
										},
									}}
								/>
							)}
						</Grid>
						<Grid item lg={4} xs={12} />
						<Grid item lg={6} xs={12}>
							<Button variant="contained" onClick={onJoinClick}>
								Join Game
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		</>
	);
}
