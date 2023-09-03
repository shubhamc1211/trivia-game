import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, TextField, Button,Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import APIs from 'utils/APIs';
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VerifyQuestion.css';


function VerifyQuestion() {
  const location = useLocation();
  const navigate = useNavigate();;
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [specificAnswer, setSpecificAnswer] = useState('');
  const { userId } = location.state || {};
  const {email} = location.state || {};
  
  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleValidation = (e) => {
    e.preventDefault();

    const payload = {
      question: question,
      answer: answer,
      specificAnswer: specificAnswer,
      userId: userId
    };
    console.log(specificAnswer)

    console.log(userId)

    axios
      .post(APIs.API_VALIDATE_ANSWER, payload)
      .then((response) => {
        console.log(response.data);
        if (response.data.statusCode == 200){
          toast.success("User verification sucessful. The user is now logged in!")
          localStorage.setItem('userId', userId); 
          localStorage.setItem('email', email); 
          setTimeout(() => {
          navigate(`/user/${userId}/edit`);
        }, 2000);
       
        }
        else{
          toast.error("Incorrect answer to the question provided! Login unsucessful")
        }
      })
      .catch((error) => {
        toast.error("Error validating answer!");
      });
  };

  const questions = [
    { question: "What was your first car?", specificAnswer: "firstCar" },
    { question: "What is your favorite color?", specificAnswer: "favoriteColor" },
    { question: "What is your pet's name?", specificAnswer: "firstPet" },
  ];
  const randomIndex = Math.floor(Math.random() * questions.length);
  const randomQuestion = questions[randomIndex].question;
  const randomSpecificAnswer = questions[randomIndex].specificAnswer;

  useEffect(() => {
    setQuestion(randomQuestion);
    setSpecificAnswer(randomSpecificAnswer);
  }, []);


  return (
    <div className="container">
      <Box>
      <ToastContainer />
      <Typography variant="h4" className="question">
        {question}
      </Typography>
      <br/>
      <TextField
        name="answer"
        value={answer}
        onChange={handleAnswerChange}
        className={"answerInput"}
        placeholder="Enter your answer"
      />
      <br />
      <br/>
      <Button
        variant="contained"
        onClick={handleValidation}
        className={"submitButton"}
      >
        Validate
      </Button>
      </Box>
    </div>
  );
}

export default VerifyQuestion;
