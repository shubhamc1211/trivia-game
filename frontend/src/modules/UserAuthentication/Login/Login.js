import React, { useState } from 'react';
import { Box, FormGroup, Grid, Button, FormControl, InputLabel, Input } from "@mui/material";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from "react-router-dom";
import { signIn, handleGoogleLogin, handleFacebookLogin, handlePasswordReset } from '../../../utils/authUtils';
import "./Login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const { state } = useLocation();
  const { errorMessage } = state || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);


  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    signIn(email, password)
      .then((response) => {
        console.log(response);
        if (response.error) {
          toast.error(response.error)
        }
        else {
          const userId = response.userID
          localStorage.setItem('userId', userId);
          navigate("/validate", { state: { "userId": userId, "email": email } });
        }
      }).catch((error) => {
        console.log(error);
        if (error.errorCode == "auth/wrong-password") {
          toast.error("Incorrect Password entered please try again");
        } else if (error.errorCode == "auth/user-not-found"){
          toast.error("User not found, please register first!")
        }
        else {
          toast.error("Error while login")
        }
      });
  };

  const FormControlStyle = {
    width: '100%',
    marginBottom: '20px'
  };

  const ButtonStyle = {
    marginTop: '20px'
  };

  const handleGoogleLoginClick = () => {


    handleGoogleLogin()
      .then((userId) => {
        localStorage.setItem('userId', userId);
        navigate("/validate", { state: { userId: userId, "email": email } });
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 500 && error.response.data.errorCode == "auth/wrong-password") {
          toast.error("Incorrect Password entered please try again");
        } else {
          toast.error("Error while login")
        }
      });
  };

  const handleFacebookLoginClick = () => {
    // Call handleFacebookLogin and return the promise
    handleFacebookLogin().then((userId) => {
      localStorage.setItem('userId', userId);
      navigate("/validate", { state: { userId: userId, "email": email } });
    }).catch((error) => {
      console.log(error);
      if (error.response.status == 500 && error.response.data.errorCode == "auth/wrong-password") {
        toast.error("Incorrect Password entered please try again");
      } else {
        toast.error("Error while login")
      }
    });
  };

  const handlePasswordResetClick = () => {
    // Prompt the user to enter their email address
    const resetEmail = prompt("Please enter your email address to reset the password:");

    if (resetEmail) {
      // Call handlePasswordReset and return the promise
      handlePasswordReset(resetEmail)
        .then(() => {
          toast.success("Password reset email sent successfully. Please check your inbox.");
        })
        .catch((error) => {
          console.log(error);

          toast.error("User with this email address not found.");

        });
    }
  };
  return (
    <Box className="login-container">
      <ToastContainer />
      <Helmet>
        <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0&appId=1306758613252518&autoLogAppEvents=1"></script>
      </Helmet>
      <Grid container justifyContent="center">
        <FormGroup>
          <h1 className='title'>Login please</h1>
          <FormControl sx={FormControlStyle}>
            <InputLabel>Email</InputLabel>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} />
          </FormControl>
          <FormControl sx={FormControlStyle}>
            <InputLabel>Password</InputLabel>
            <Input type="password" Input value={password} onChange={(event) => setPassword(event.target.value)} />
          </FormControl>
          <Button onClick={handleSubmit} variant="contained">
            Login
          </Button>
          <br />
          <Button onClick={handleGoogleLoginClick} variant="contained" color="secondary" className="buttonStyle">
            Login with Google
          </Button>
          <br />
          <Button onClick={handleFacebookLoginClick} variant="contained" color="secondary" className="buttonStyle">
            Login with Facebook
          </Button>
          <br />
          <Link to="/register">
            <Button variant="text" sx={ButtonStyle}>Not Registered? Register here</Button>
          </Link>
          <br />
          <Link to="#" onClick={handlePasswordResetClick}>
            Forgot Password? Click here to reset
          </Link>

        </FormGroup>
      </Grid>
    </Box>
  );
};

export default Login;
