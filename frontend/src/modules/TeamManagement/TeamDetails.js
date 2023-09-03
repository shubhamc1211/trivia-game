import React, { useEffect, useState } from "react";
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function TeamDetails() {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const getTeamById = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/userteam/getteambyid";
	const teamManagement = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/userteam/getteambyid/teammanagementactions";
	const sendTeamInvite = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/teaminvitation/sendteaminvite";
	const { teamId } = useParams();
	const [team, setTeam] = useState(null);
	const [refresh, setRefresh] = useState(true);
	const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteEmailError, setInviteEmailError] = useState(false);
	const loggedInUser = localStorage.getItem("userId");

	const handleInviteDialogOpen = () => {
		setInviteDialogOpen(true);
	};

	const handleInviteDialogClose = () => {
		setInviteDialogOpen(false);
		setInviteEmail("");
		setInviteEmailError(false);
	};

	const handleInvite = async (emailId) => {
		console.log(`Sending invite to ${inviteEmail}`);
		await axios.post(sendTeamInvite, { teamId: teamId, emailId: emailId }).then((res) => {
			if (res.data.statusCode === 200) {
				toast.success("Invite sent successfully");
			} else {
				toast.error("Failed to send invite");
			}
		});
		handleInviteDialogClose();
	};

	const handleInviteEmailChange = (event) => {
		const email = event.target.value;
		setInviteEmail(email);
		setInviteEmailError(!emailRegex.test(email));
	};

	const handleRemove = async (userId) => {
		console.log("Removing user: " + userId);
		await axios.post(teamManagement, { action: "leave", teamId: teamId, userId: userId }).then((res) => {
			if (res.data.statusCode === 200) {
				toast.success("Removed user from team successfully");
			} else {
				toast.error("Unable to remove user from team");
			}
		});
		setRefresh(!refresh);
	};

	const handlePromote = async (userId) => {
		await axios.post(teamManagement, { action: "promote", teamId: teamId, userId: userId }).then((res) => {
			if (res.data.statusCode === 200) {
				toast.success("Promoted user to admin successfully");
			} else {
				toast.error("Unable to promote user to admin");
			}
			setRefresh(!refresh);
		});
	};

	const handleLeave = async (userId) => {
		await axios.post(teamManagement, { action: "leave", teamId: teamId, userId: userId }).then((res) => {
			if (res.data.statusCode === 200) {
				toast.success("Successfully left team");
			} else {
				toast.error("Unable to leave team");
			}
		});
		setRefresh(!refresh);
	};

	useEffect(() => {
		const getTeam = async () => {
			await axios
				.post(getTeamById, {
					id: teamId,
				})
				.then((res) => {
					const result = res.data.body;
					if (res.data.statusCode === 200) {
						console.log(res.data);
						setTeam({
							id: result.teamId,
							name: result.teamName,
							wins: result.totalGamesWon,
							games: result.totalGamesPlayed,
							members: result.members.map((member) => ({
								name: member.userName,
								email: member.userEmail,
								role: member.role,
								userId: member.userId,
							})),
						});
					}
				});
		};
		getTeam();
	}, [teamId, refresh]);

	if (!team) {
		return <div>Loading...</div>; // or your own loading component
	}

	const isAdmin = team.members.some((member) => member.userId === loggedInUser && member.role === "admin");

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
			<ToastContainer />
			<Typography variant="h4">{team.name}</Typography>

			<Box sx={{ mt: 2 }}>
				<Typography variant="h6">Total Wins: {team.wins}</Typography>
				<Typography variant="h6">Total Games Played: {team.games}</Typography>
				<Typography variant="h6">Win/Loss Ratio: {(team.games > 0 ? team.wins / team.games : 0).toFixed(2)}</Typography>
			</Box>

			<TableContainer component={Paper} sx={{ mt: 3 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Role</TableCell>
							{isAdmin && <TableCell>Actions</TableCell>}
						</TableRow>
					</TableHead>
					<TableBody>
						{team.members.map((member) => (
							<TableRow key={member.userId}>
								<TableCell>{member.name}</TableCell>
								<TableCell>{member.email}</TableCell>
								<TableCell>{member.role}</TableCell>
								{isAdmin && (
									<TableCell>
										{member.userId !== loggedInUser && member.role !== "admin" && (
											<Button color="info" variant="outlined" onClick={() => handlePromote(member.userId)}>
												Make Admin
											</Button>
										)}
										{member.userId !== loggedInUser && (
											<Button color="error" variant="outlined" sx={{ ml: 1 }} onClick={() => handleRemove(member.userId)}>
												Remove From Team
											</Button>
										)}
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{isAdmin && (
				<Box sx={{ mt: 2 }}>
					<Button color="info" variant="outlined" onClick={handleInviteDialogOpen}>
						Invite User
					</Button>

					<Dialog open={inviteDialogOpen} onClose={handleInviteDialogClose}>
						<DialogTitle>Invite User</DialogTitle>
						<DialogContent>
							<DialogContentText>Enter the email of the user you want to invite to the team.</DialogContentText>
							<TextField
								autoFocus
								margin="dense"
								id="email"
								label="Email Address"
								type="email"
								fullWidth
								error={inviteEmailError}
								helperText={inviteEmailError ? "Enter a valid email" : ""}
								value={inviteEmail}
								onChange={handleInviteEmailChange}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleInviteDialogClose}>Cancel</Button>
							<Button onClick={() => handleInvite(inviteEmail)} disabled={!emailRegex.test(inviteEmail)}>
								Send Invite
							</Button>
						</DialogActions>
					</Dialog>
				</Box>
			)}
			{!isAdmin && (
				<Button color="error" variant="outlined" sx={{ ml: 2 }} onClick={() => handleLeave(loggedInUser)}>
					Leave Team
				</Button>
			)}
		</Box>
	);
}

export default TeamDetails;
