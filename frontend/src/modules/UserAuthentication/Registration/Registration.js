import { Box, Button, FormControl, FormGroup, Grid, Input, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import APIs from "utils/APIs";
import "./Registration.css";
import { register,handleGoogleLogin, handleFacebookLogin } from '../../../utils/authUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Registration() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    

    const FormControlStyle = {
        width: '100%',
        marginBottom: '20px'
    };

    const ButtonStyle = {
        marginTop: '20px'
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast.error("Please enter a valid email address.");
          return;
        }
    
        // Validate all fields are filled
        if (!email || !password || !confirmPassword) {
          toast.error("Please fill in all the required fields.");
          return;
        }
    
        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }
        
        if (password === confirmPassword) {
          // Proceed with registration
          register(email,password)
            .then((response) => {
              console.log("hii")
              console.log(response);
              toast.success("user registered successfully")
              console.log(response.userID)
              const userId = response.userID
              navigate("/questions", { state: { "userId" : userId , "email": email} });
            })
            .catch((error) => {
              console.log(error);
              if (error.code == 400 || error.message.includes("auth/email-already-in-use")) {
                toast.error("User is already registered. Please log in");
              }
              else {
                toast.error("An error occurred during registration. Please try again");
              }
            });
        } else {
          // Show error message or take appropriate action
          toast.error("Passwords do not match");
        }
      };

      const handleGoogleLoginClick = () => {
        // Call handleGoogleLogin and return the promise
        handleGoogleLogin().then((userId) => {
          localStorage.setItem('userId', userId); 
          localStorage.setItem('email', email); 
          navigate("/questions", { state: { "userId" : userId , "email": email} });
        }).catch((error) => {
          if (error.response.status == 500 && error.response.data.errorCode == "auth/email-already-in-use") {
            toast.error("User is already registered. Please log in.");
          }
          else {
            toast.error("An error occurred during registration. Please try again");
          }
        });
      };
      

      const handleFacebookLoginClick = () => {
        // Call handleFacebookLogin and return the promise
        handleFacebookLogin().then((userId) => {
            localStorage.setItem('userId', userId); 
            localStorage.setItem('email', email);             
            navigate("/questions", { state: { "userId" : userId , "email": email} });
        }).catch((error) => {
          if (error.response.status == 500 && error.response.data.errorCode == "auth/email-already-in-use") {
            toast.error("User is already registered. Please log in.");
          }
          else {
            toast.error("An error occurred during registration. Please try again");
          }
        });
      };

    return (
        <Box className="register-container">
          <ToastContainer />
          <Grid container justifyContent="center">
            <FormGroup className="formStyle">
              <h1 className='title'>Register Here</h1>
              <FormControl sx={FormControlStyle}>
                <InputLabel>Email</InputLabel>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} />
              </FormControl>
              <FormControl sx={FormControlStyle}>
                <InputLabel>Password</InputLabel>
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </FormControl>
              <FormControl sx={FormControlStyle}>
                <InputLabel>Confirm Password</InputLabel>
                <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </FormControl>
              <Button onClick={handleSubmit} variant="contained" className="btn">
                Register
              </Button>
              <br/>
              <Button onClick={handleGoogleLoginClick} variant="contained" color="secondary" className="buttonStyle">
                Login with Google
              </Button>
              <br/>
              <Button onClick={handleFacebookLoginClick} variant="contained" color="secondary" className="buttonStyle">
                Login with Facebook
              </Button>
              <br/>

              <Link to="/login">
                <Button variant="text" sx={ButtonStyle}>Already Registered? Login in</Button>
              </Link>
            </FormGroup>
          </Grid>
        </Box>
      );   
}

export default Registration;