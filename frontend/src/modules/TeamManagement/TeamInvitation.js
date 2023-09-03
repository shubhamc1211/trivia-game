import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function TeamInvitation() {
	const replyInvite = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/teaminvitation/replyteaminvite";
	const getUserUrl = "https://us-central1-serverless-csci-5410.cloudfunctions.net/getUser";
	const [user, setUser] = useState(null);

	const { teamId } = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		const getUser = async () => {
			await axios
				.post(getUserUrl, { id: localStorage.getItem("userId") })
				.then((res) => {
					console.log(res.data);
					setUser(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		getUser();
	}, []);
	const handleAccept = async () => {
		console.log("Accepted");
		await axios
			.post(replyInvite, { teamId: teamId, userId: user.id, userName: user.name, userEmail: user.email, status: "Accepted" })
			.then((res) => {
				console.log(res.data);
				if (res.data.statusCode === 200) {
					toast.success("You have joined the team successfully");
				} else {
					toast.error("Not able to join the team");
				}
			})
			.catch((err) => {
				console.log(err);
			});
		navigate("/team");
	};

	const handleDecline = async () => {
		console.log("Declined");
		navigate("/team");
	};
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
				mt: 5,
			}}
		>
			<ToastContainer />
			<Typography variant="h6" component="div">
				You are invited to join the new team?
			</Typography>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: 2,
				}}
			>
				<Button variant="contained" onClick={handleAccept} color="success">
					Accept
				</Button>
				<Button variant="contained" onClick={handleDecline} color="error">
					Decline
				</Button>
			</Box>
		</Box>
	);
}

export default TeamInvitation;
