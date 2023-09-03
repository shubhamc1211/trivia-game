import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import APIs from "utils/APIs";
import "./Questionnaire.css";

const Questionnaire = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const { email } = location.state || {};
  const [answers, setAnswers] = useState({
    firstCar: '',
    favoriteColor: '',
    firstPet: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prevAnswers) => ({ ...prevAnswers, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstCar, favoriteColor, firstPet } = answers;
    console.log(userId);
  
    axios
      .post(APIs.API_SUBSCRIBE_SNS, {
        message: " ",
        subject: " ",
        email: email,
        isSubscribe: true,
      })
      .then((response) => {
        console.log("SNS subscription");
        console.log(response);
  
        axios
          .post(APIs.API_PUT_NOTIFICATION, {
            date: "1/1",
            notification: "User account created",
            id: userId,
            path: " ",
            goToLocation: " ",
          })
          .then((response) => {
            console.log("Put Notification");
            console.log(response);
  
            axios
              .post(APIs.API_STORE_DATA, {
                userId: userId,
                firstCar: firstCar,
                favoriteColor: favoriteColor,
                firstPet: firstPet,
              })
              .then((response) => {
                console.log(response);
                navigate("/login", { state: { userId: userId } });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  return (
    <div>
      <Typography variant="h2">Second Factor Authentication</Typography>

      <div className="container">

        <Typography variant="h4">Please answer these questions</Typography>

        <div className="formContainer">
          <TextField
            name="firstCar"
            label="What was your first car?"
            value={answers.firstCar}
            onChange={handleInputChange}
          />
          <TextField
            name="favoriteColor"
            label="What is your favorite color?"
            value={answers.favoriteColor}
            onChange={handleInputChange}
          />
          <TextField
            name="firstPet"
            label="What is your pet's name?"
            value={answers.firstPet}
            onChange={handleInputChange}
          />
          <Button
            className="button"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
