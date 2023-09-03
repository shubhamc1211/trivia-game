import React, { useEffect } from "react";
import "./Left.css";
import PercentIcon from "@mui/icons-material/Percent";
import { Link, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useState } from "react";
import APIs from "utils/APIs";
import myAxios from "utils/MyAxios";
import axios from "axios";

const Left = ({ id }) => {
  const navigate = useNavigate();
  const [editClicked, updateEdit] = useState(0);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const body = { id: id };
    const email = localStorage.getItem("email");
    console.log(body, email);
    // if (id != localStorage.getItem("userId")) {
    //   console.log("going to login:", id, localStorage.getItem("userId"));
    //   navigate(`/login`);
    // }
    await axios
      .post(APIs.API_GET_USER, { id: id, email: email })
      .then((response) => {
        console.log(response);
        setProfile(response.data);
      });

    await axios
      .post(APIs.API_GET_USER_PROFILE_IMAGE, { id })
      .then((response) => {
        console.log(response);
        const imageUrl = response.data;
        const decodedImage = Buffer.from(imageUrl, "base64");
        setProfileImage(
          `data:image/jpeg;base64,${decodedImage.toString("base64")}`
        );
      })
      .catch((error) => {
        console.log("error :", error);
        setProfileImage("");
      });
  };

  // const handleEdit = () => {
  //   console.log("Edit clicked", `/user/${profile.id}/edit`);
  //   updateEdit(!editClicked);
  //   console.log("Edit clicked end", `/user/${profile.id}/edit`);
  // };

  useEffect(() => {
    console.log("click value:", editClicked);
    if (editClicked != 0) {
      navigate(`/user/${id}/edit`, { state: { profile, profileImage } });
    }
  }, [editClicked]);

  if (profile === null || profileImage === null) {
    return (
      <div className="userProfile loadingDiv">
        <Typography variant="h3">Loading Profile..</Typography>
      </div>
    );
  } else {
    return (
      <div className="Left">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography className="personalInformation" variant="h4">
                  Personal Information
                </Typography>
                <div className="personalData">
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <Avatar src={profileImage} alt="Profile" />
                    </Grid>
                    <Grid item xs={10}>
                      <Typography>Name: {profile?.name}</Typography>
                      <Typography>Phone: {profile?.contact}</Typography>
                      <Typography>Email: {profile?.email}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        component={Link}
                        onClick={() => updateEdit(!editClicked)}
                      >
                        Edit
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography className="personalInformation" variant="h4">
                  User Statistics
                </Typography>
                <div className="personalData">
                  <Grid container spacing={2}>
                    <Grid item xs={9}>
                      <Box
                        className="Box"
                        border={1}
                        borderRadius={4}
                        padding={2}
                        elevation={3}
                      >
                        <Typography>
                          <span style={{ fontWeight: "bold" }}>
                            Games Played:
                          </span>{" "}
                          {profile?.gamesPlayed}
                        </Typography>
                      </Box>
                      <Box
                        className="Box"
                        border={1}
                        borderRadius={4}
                        padding={2}
                        elevation={3}
                      >
                        <Typography>
                          <span style={{ fontWeight: "bold" }}>
                            Total Points:
                          </span>{" "}
                          {profile?.totalPoints}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        className="Box"
                        border={1}
                        borderRadius={4}
                        padding={2}
                        elevation={3}
                      >
                        <Typography>
                          <PercentIcon />
                        </Typography>
                        <Typography fontSize={30}>
                          {profile?.winLossRatio}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default Left;
