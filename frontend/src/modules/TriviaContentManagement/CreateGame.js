import React, { useState } from 'react';
import {
    Box,
    FormGroup,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Input,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';

function getDateTime(date) {

    let year = date.year();

    let month = date.month() + 1;

    let day = date.date();

    let hour = date.hour();

    let minute = date.minute();

    let second = date.second();



    month = month < 10 ? `0${month}` : month;

    day = day < 10 ? `0${day}` : day;

    hour = hour < 10 ? `0${hour}` : hour;

    minute = minute < 10 ? `0${minute}` : minute;

    second = second < 10 ? `0${second}` : second;



    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;



}

const CreateGame = () => {
    const [gameName, setGameName] = useState('');
    const [question, setQuestion] = useState('');
    const [category, setCategory] = useState('sports');
    const [difficulty, setDifficulty] = useState('easy');
    const [answer, setAnswer] = useState('');
    const [explanation, setExplanation] = useState('');
    const [options, setOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [maxDuration, setMaxDuration] = useState('');
    const [gameId, setGameId] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // New state for entered Game Id
    const [enteredGameId, setEnteredGameId] = useState('');

    const handleGameNameChange = (e) => {
        setGameName(e.target.value);
    };

    // Function to handle changes in Game Id field
    const handleGameIdChange = (e) => {
        setEnteredGameId(e.target.value);
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
    };

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const handleExplanationChange = (e) => {
        setExplanation(e.target.value);
    };

    const handleOptionChange = (index) => (e) => {
        const updatedOptions = [...options];
        updatedOptions[index] = e.target.value;
        setOptions(updatedOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, '']); // Add an empty option
    };

    const handleRemoveOption = (index) => () => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1); // Remove the option at index
        setOptions(updatedOptions);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            question,
            category,
            difficulty,
            answer,
            explanation,
            options,
        };
        setQuestions([...questions, newQuestion]);
        setQuestion('');
        setAnswer('');
        setExplanation('');
        setOptions([]); // Clear options
        setEditIndex(null); // Clear editIndex
    };

    const handleEditQuestion = (index) => {
        const selectedQuestion = questions[index];
        setQuestion(selectedQuestion.question);
        setCategory(selectedQuestion.category);
        setDifficulty(selectedQuestion.difficulty);
        setAnswer(selectedQuestion.answer);
        setExplanation(selectedQuestion.explanation);
        setOptions(selectedQuestion.options);
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1); // Remove the selected question from the questions array
        setQuestions(updatedQuestions);
        setEditIndex(index); // Set editIndex to the selected question index
    };

    const handleDeleteQuestion = (index) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this question?');
        if (shouldDelete) {
            const updatedQuestions = [...questions];
            updatedQuestions.splice(index, 1); // Remove the question at index
            setQuestions(updatedQuestions);
        }
    };

    const handleCancelEdit = () => {
        setQuestion('');
        setCategory('sports');
        setDifficulty('easy');
        setAnswer('');
        setOptions([]); // Clear options
        setEditIndex(null); // Clear editIndex
    };

    const handleUpdateQuestion = () => {
        const updatedQuestion = {
            question,
            category,
            difficulty,
            answer,
            explanation,
            options,
        };
        setQuestions([...questions, updatedQuestion]); // Add the updated question back to the questions array
        setQuestion('');
        setCategory('sports');
        setDifficulty('easy');
        setAnswer('');
        setExplanation('');
        setOptions([]); // Clear options
        setEditIndex(null); // Clear editIndex
    };

    const createTable = async () => {
        try {
            await axios.get('https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/save-game-details');
            console.log('Table created successfully');
        } catch (error) {
            console.error('Error creating table:', error);
        }
    };

    // Function to load game details based on the entered Game Id
    const loadGameDetails = async () => {
        try {
            const response = await axios.get(`https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/get-game-by-id?gameId=${enteredGameId}`);
            const { gameName, questions, maxDuration } = response.data.gameDetails;
            setGameName(gameName);
            setQuestions(questions);
            setMaxDuration(maxDuration);
            setGameId(enteredGameId);
            // Clear the error message on successful game load
            setErrorMessage('');
        } catch (error) {
            console.error('Error loading game details:', error);
        }
    };

    const handleCreateGame = async () => {

        try {
            await createTable();
            const userId = localStorage.getItem('userId') ?? "1234567890";
            // const userName = localStorage.getItem('userName') ?? "User";
            const response = await axios.post('https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/save-game-details?userId=${userId}', {
                userId,
                startDate,
                endDate,
                gameDetails: {
                    gameName,
                    questions,
                    maxDuration,
                    // createdTime: new Date().toISOString(),
                    //updatedTime: new Date().toISOString(),
                },
            });
            console.log('Game details saved:', response.data);
            setGameId(response.data.gameId);
            setSuccessMessage('Game created successfully');
        } catch (error) {
            console.error('Error saving game details:', error);
        }
    };

    const handleUpdateGame = async () => {
        try {
            await createTable();
            const userId = localStorage.getItem('userId') ?? '1234567890';
            const response = await axios.post('https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/save-game-details?userId=${userId}', {
                userId,
                gameDetails: {
                    gameId, // Use the existing gameId received from the backend
                    gameName,
                    questions,
                    maxDuration,
                    //createdTime: new Date().toISOString(),
                    //updatedTime: new Date().toISOString(),
                },
            });
            console.log('Game details updated:', response.data);
        } catch (error) {
            console.error('Error updating game details:', error);
        }
    };

    const handleDeleteGame = async () => {
        const shouldDelete = window.confirm('Are you sure you want to delete this game?');
        if (shouldDelete) {
            try {
                await axios.post('https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/delete-game', {
                    gameId,
                });
                setGameId(''); // Clear the gameId after successful deletion
                setQuestions([]); // Clear the questions array after successful deletion
                setGameName('');
                setMaxDuration('');
                setSuccessMessage('Game deleted successfully');
            } catch (error) {
                console.error('Error deleting game:', error);
            }
        }
    };

    const handleMaxDurationChange = (e) => {
        setMaxDuration(e.target.value);
    };

    const handleDateChange = (newValue) => {
        // Extract date and time information from the newValue object
        const selectedDate = newValue; // This is the Date object representing the selected date

        // Get individual date components
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // Months are zero-based, so add 1
        const day = selectedDate.getDate();

        // Get individual time components
        const hours = selectedDate.getHours();
        const minutes = selectedDate.getMinutes();
        const seconds = selectedDate.getSeconds();

        console.log('Selected Date:', `${year}-${month}-${day}`);
        console.log('Selected Time:', `${hours}:${minutes}:${seconds}`);
    };

    const formControlStyle = {
        width: '100%',
        marginBottom: '20px',
    };

    const buttonStyle = {
        marginTop: '20px',
    };

    return (
        <Box style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <Box className="container" style={{ marginTop: '200px' }}>
                <h1>Create Trivia Game</h1>
                <Grid container justifyContent="center">
                    <FormGroup>
                        <FormControl sx={formControlStyle}>
                            <InputLabel>Game Id (Optional):</InputLabel>
                            <Input value={enteredGameId} onChange={handleGameIdChange} />
                        </FormControl>
                        {/* Load Game and Clear Game buttons */}
                        <Grid container justifyContent="center">
                            <Button onClick={loadGameDetails} variant="outlined" sx={buttonStyle}>
                                Load Game
                            </Button>
                            <Button onClick={() => setEnteredGameId('')} variant="outlined" sx={buttonStyle}>
                                Clear Game
                            </Button>
                        </Grid>
                        <FormControl sx={formControlStyle}>
                            <InputLabel>Game Name:</InputLabel>
                            <Input value={gameName} onChange={handleGameNameChange} />
                        </FormControl>
                        <FormControl sx={formControlStyle}>
                            <InputLabel>Max Duration (in minutes):</InputLabel>
                            <Input type="number" value={maxDuration} onChange={handleMaxDurationChange} />
                        </FormControl>
                        <FormControl>
                            {/* Date range picker */}
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <Typography variant="h6" gutterBottom component="div">
                                    <span
                                        style={{
                                            display: "block",
                                        }}
                                    >
                                        Date range
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                        }}
                                    >
                                        <div
                                            style={{
                                                marginRight: "16px",
                                            }}
                                        >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="Start Date"
                                                    onChange={(newValue) => {
                                                        setStartDate(getDateTime(newValue))
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="End Date"
                                                onChange={(newValue) => {
                                                    setEndDate(getDateTime(newValue))
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </Typography>
                            </Grid>
                        </FormControl>

                        <h2>Add Question</h2>
                        <FormControl sx={formControlStyle}>
                            <InputLabel>Question:</InputLabel>
                            <Input value={question} onChange={handleQuestionChange} />
                        </FormControl>
                        <FormControl sx={formControlStyle}>
                            <RadioGroup
                                row
                                aria-label="category"
                                name="category"
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <FormControlLabel value="sports" control={<Radio />} label="Sports" />
                                <FormControlLabel value="computer_science" control={<Radio />} label="Computer Science" />
                                <FormControlLabel value="general_knowledge" control={<Radio />} label="General Knowledge" />
                                <FormControlLabel value="entertainment" control={<Radio />} label="Entertainment" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl sx={formControlStyle}>
                            <RadioGroup
                                row
                                aria-label="difficulty"
                                name="difficulty"
                                value={difficulty}
                                onChange={handleDifficultyChange}
                            >
                                <FormControlLabel value="easy" control={<Radio />} label="Easy" />
                                <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" />
                                <FormControlLabel value="difficult" control={<Radio />} label="Difficult" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl sx={formControlStyle}>
                            <InputLabel>Answer:</InputLabel>
                            <Input value={answer} onChange={handleAnswerChange} />
                        </FormControl>
                        <FormControl sx={formControlStyle}>
                            <InputLabel>Explanation:</InputLabel>
                            <Input value={explanation} onChange={handleExplanationChange} />
                        </FormControl>
                        <h3>Answer Options:</h3>
                        {options.map((option, index) => (
                            <Grid container spacing={2} alignItems="center" key={index}>
                                <Grid item xs={9}>
                                    <FormControl sx={formControlStyle}>
                                        <InputLabel>Option {index + 1}:</InputLabel>
                                        <Input value={option} onChange={handleOptionChange(index)} />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button onClick={handleRemoveOption(index)} variant="outlined">
                                        Remove Option
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid container justifyContent="center">
                            <Button onClick={handleAddOption} variant="contained" sx={buttonStyle}>
                                Add Option
                            </Button>
                        </Grid>
                        {editIndex !== null ? (
                            <Grid container justifyContent="center" style={{ marginTop: '10px' }}>
                                <Button onClick={handleUpdateQuestion} variant="contained">
                                    Update Question
                                </Button>
                                <Button onClick={handleCancelEdit} variant="outlined" style={{ marginLeft: '10px' }}>
                                    Cancel Edit
                                </Button>
                            </Grid>
                        ) : (
                            <Grid container justifyContent="center" style={{ marginTop: '10px' }}>
                                <Button onClick={handleAddQuestion} variant="contained">
                                    Add Question
                                </Button>
                            </Grid>
                        )}
                    </FormGroup>
                </Grid>
            </Box>
            <Box className="container" style={{ marginTop: '0px' }}>
                <Grid container justifyContent="center">
                    <h2>Questions:</h2>
                    <ul>
                        {questions.map((q, index) => (
                            <li key={index}>
                                Question: {q.question}, Category: {q.category}, Difficulty: {q.difficulty}, Answer: {q.answer}, Explanation: {q.explanation}
                                <ul>
                                    {q.options.map((option, optionIndex) => (
                                        <li key={optionIndex}>
                                            Option {optionIndex + 1}: {option}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    onClick={() => handleEditQuestion(index)}
                                    variant="outlined"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleDeleteQuestion(index)}
                                    variant="outlined"
                                    style={{ marginLeft: '10px', color: 'red' }}
                                >
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Grid container justifyContent="center">
                        {gameId ? (
                            <>
                                <Button onClick={handleUpdateGame} variant="contained" sx={buttonStyle}>
                                    Update Game
                                </Button>
                                <Button onClick={handleDeleteGame} variant="outlined" style={{ marginLeft: '10px', color: 'red' }}>
                                    Delete Game
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleCreateGame} variant="contained" sx={buttonStyle}>
                                Create Game
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Box>
            {successMessage && (
                <Typography variant="body1" style={{ color: 'green', textAlign: 'center' }}>
                    {successMessage}
                </Typography>
            )}
            {errorMessage && (
                <Typography variant="body1" style={{ color: 'red', textAlign: 'center' }}>
                    {errorMessage}
                </Typography>
            )}
        </Box>
    );
};

export default CreateGame;
