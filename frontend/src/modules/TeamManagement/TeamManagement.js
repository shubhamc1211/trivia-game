import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function TeamManagement() {
	const generateTeamNameUrl = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/team";
	const getUserTeams = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/userteam";
	const getUserUrl = "https://us-central1-serverless-csci-5410.cloudfunctions.net/getUser";

	const [teams, setTeams] = useState([]);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const [teamName, setTeamName] = useState("");

	const handleClickOpen = () => {
		regenerateTeamName();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAddTeam = async () => {
		await axios
			.post(generateTeamNameUrl, {
				teamName: teamName,
				member: {
					userId: user.id,
					userName: user.name,
					userEmail: user.email,
				},
			})
			.then((res) => {
				console.log(res.data);
				if (res.data.statusCode === 200) {
					toast.success("Team added successfully");
				} else {
					toast.error("Not able to create team");
				}
			});
		getTeams();
		setTeamName("");
		handleClose();
	};

	const regenerateTeamName = () => {
		axios.get(generateTeamNameUrl).then((res) => {
			setTeamName(JSON.parse(res.data.body).teamName);
		});
	};

	useEffect(() => {
		const getUser = async () => {
			await axios
				.post(getUserUrl, { id: localStorage.getItem("userId") })
				.then((res) => {
					setUser(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		getUser();
	}, []);
	const getTeams = async () => {
		await axios
			.post(getUserTeams, {
				userId: localStorage.getItem("userId"), // replace this with the actual user id
			})
			.then((res) => {
				const result = JSON.parse(res.data.body);
				console.log(result);
				if (res.data.statusCode === 200) {
					setTeams(result.teams);
				}
			});
	};
	useEffect(() => {
		getTeams();
	}, []);

	return (
		<div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
			<ToastContainer />
			<Button variant="outlined" color="primary" onClick={handleClickOpen}>
				Add Team
			</Button>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Add New Team</DialogTitle>
				<DialogContent>
					<DialogContentText>Please enter the new team name.</DialogContentText>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<TextField
							autoFocus
							margin="dense"
							label="Team Name"
							type="text"
							style={{ flex: "1 0 50%" }}
							value={teamName}
							onChange={(e) => setTeamName(e.target.value)}
						/>
						<Button variant="outlined" onClick={regenerateTeamName} style={{ flex: "1 0 20%", marginLeft: "10px" }}>
							Regenerate
						</Button>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button variant="outlined" onClick={handleAddTeam} color="primary">
						Add
					</Button>
				</DialogActions>
			</Dialog>

			<TableContainer component={Paper} style={{ marginTop: "20px" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Team Name</TableCell>
							<TableCell>Total Wins</TableCell>
							<TableCell>Total Games Played</TableCell>
							<TableCell>Total Points</TableCell>
							<TableCell>Win/Loss Ratio</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teams.map((team, index) => (
							<TableRow key={index}>
								<TableCell>
									<Link
										component="button"
										variant="body2"
										onClick={() => {
											navigate(`/teamdetails/${team.id}`); // replace with your route
										}}
									>
										{team.teamName}
									</Link>
								</TableCell>
								<TableCell>{team.totalGamesWon}</TableCell>
								<TableCell>{team.totalGamesPlayed}</TableCell>
								<TableCell>{team.totalpoints}</TableCell>
								<TableCell>{(team.totalGamesPlayed > 0 ? team.totalGamesWon / team.totalGamesPlayed : 0).toFixed(2)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default TeamManagement;
