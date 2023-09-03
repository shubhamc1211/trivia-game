import React from "react";
import "./Games.css";
import { Grid, Select, TextField, Typography, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import APIs from 'utils/APIs';

const formattedDateTime = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric'
});
// Material UI Components
export default function Games() {
	const [categories, setCategories] = React.useState([
		"All",
	]);

	const [difficulty, setDifficulty] = React.useState([
		"All",
	]);

	const [games, setGames] = React.useState([]);
	const [filteredGames, setFilteredGames] = React.useState([...games]);

	const navigate = useNavigate();

	const [filter, setFilter] = React.useState({
		category: categories[0],
		difficulty: difficulty[0],
		search: "",
	});

	React.useEffect(() => {
		axios.post(APIs.API_GET_FILTERED_GAMES, {
			filter: filter,
		})
			.then((response) => {
				const newGames = response.data;
				setFilteredGames(newGames);
			});

	}, [filter, games]);


	React.useEffect(() => {
		axios.get(APIs.API_ALL_GAMES)
			.then((response) => {
				const data = response.data;
				const fetchedGames = data[0];

				// clear games
				const newGames = [];
				const categories = new Set();
				const difficulty = new Set();

				// add games
				for (let i = 0; i < fetchedGames.length; i++) {
					const game = fetchedGames[i];
					const gameDetails = game.gameDetails;
					const questions = gameDetails.questions;

					// add categories
					questions.forEach((question) => {
						categories.add(question.category);
						difficulty.add(question.difficulty);
					});

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

				setCategories(['All', ...categories]);
				setDifficulty(['All', ...difficulty]);
				setGames(newGames);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div className='games-container'>
			<h1>Games</h1>
			{/* Filter options */}
			<Grid container spacing={2} sx={
				{
					justifyContent: 'center',
				}
			} >
				<Grid item xs={12} sm={6} md={2} lg={2}>
					<Typography variant="h6" gutterBottom component="div">
						Category
						<Select
							native
							fullWidth
							value={filter.category}
							onChange={(event) => {
								setFilter({
									...filter,
									category: event.target.value
								});
							}}
							inputProps={{
								name: 'category',
								id: 'category',
							}}
						>
							{categories.map((category, idx) => (
								<option key={idx} value={category}>{category}</option>
							))}
						</Select>
					</Typography>
				</Grid>

				<Grid item xs={12} sm={6} md={2} lg={2}>
					<Typography variant="h6" gutterBottom component="div">
						Difficulty
						<Select
							native
							fullWidth
							value={filter.difficulty}
							onChange={(event) => {
								setFilter({
									...filter,
									difficulty: event.target.value
								});
							}}
							inputProps={{
								name: 'difficulty',
								id: 'difficulty',
							}}
						>
							{difficulty.map((difficulty, idx) => (
								<option key={idx} value={difficulty}>{difficulty}</option>
							))}
						</Select>
					</Typography>
				</Grid>

				{/* Date range picker */}
				<Grid item xs={12} sm={6} md={4} lg={4}>
					<Typography variant="h6" gutterBottom component="div">
						<span style={{
							display: "block",
						}} >
							Date range
						</span>
						<div style={{
							display: "flex",
						}} >
							<div style={{
								marginRight: "16px",
								flex: 1,
							}} >
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										label="Start Date"
										onChange={(newValue) => {
											setFilter({
												...filter,
												startDate: newValue,
											});
										}}
									/>
								</LocalizationProvider>
							</div>
							<div style={{
								marginRight: "16px",
								flex: 1,
							}} >
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										label="End Date"
										onChange={(newValue) => {
											setFilter({
												...filter,
												endDate: newValue,
											});
										}}
									/>
								</LocalizationProvider>
							</div>
						</div>
					</Typography>
				</Grid>

				{/* Search field */}
				<Grid item xs={12} sm={6} md={3} lg={3}>
					<Typography variant="h6" gutterBottom component="div">
						<span style={{
							display: 'block',
						}}>Search</span>
						<TextField
							fullWidth
							id="outlined-basic"
							label="Search"
							value={filter.search}
							variant="outlined"
							onChange={(event) => {
								setFilter({
									...filter,
									search: event.target.value
								});
							}}
						/>
					</Typography>
				</Grid>
			</Grid>

			{/* Game list */}
			<Grid container sx={{
				paddingBottom: '32px',
			}} columnSpacing={2} >
				{filteredGames.map((game) => (
					<Grid item md={6} xs={12} key={game.id} sx={{
						marginTop: '16px',
					}}
					>
						<div className='game-card'
							onClick={() => {
								localStorage.setItem('gameId', game.id);
								navigate(`/games/${game.id}`);
							}}
						>
							<div className='game-card-header'>
								<div className='game-card-header-title'>
									<h2>{game.name}</h2>
								</div>
								<div className='game-card-header-category'>
									<span>{game.category}</span>
								</div>
							</div>
							<div className='game-card-body'>
								<div className='game-card-body-difficulty'>
									<span>Difficulty: {game.difficulty}</span>
								</div>
								<div className='game-card-body-date'>
									<span>Start Time: {formattedDateTime.format(new Date(game.startTime))}</span>
								</div>
								<div className='game-card-body-date'>
									<span>End Time: {formattedDateTime.format(new Date(game.endTime))}</span>
								</div>
							</div>
							{/* success button */}
							<Button variant="text" color="secondary" sx={{
								position: 'absolute',
								bottom: '16px',
								right: '16px',
							}}
							>More</Button>
						</div>
					</Grid>
				))}
			</Grid>
		</div >
	)
}
