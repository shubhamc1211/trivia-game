import React, { useEffect, useState } from "react";
import "./Bottom.css";
import SearchIcon from "@mui/icons-material/Search";

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import APIs from "utils/APIs";
import axios from "axios";
import Dropdown from "../Dropdown/dropdown";

const Bottom = ({ id, searchUserId, setSearchUserId }) => {
  const [achievements, setAchievement] = useState(null);
  const [otherAchievement, setOtherAchievement] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [profile, setProfile] = useState(null);
  let tempSerch = null;

  useEffect(() => {
    fetchUserAchievement();
    fetchUserProfile();
  }, []);

  const fetchUserAchievement = async () => {
    const body = { id: id };
    console.log(body);
    await axios.post(APIs.API_GET_ACHIEVEMENTS, { id: id }).then((response) => {
      console.log(response);
      setAchievement(response.data);
      setOtherAchievement([]);
    });
  };

  const handleDropdownChange = (event) => {
    console.log("handle changed:", event.target.value);
    setSearchUserId(event.target.value);
    tempSerch = event.target.value;

    fetchOtherUserAchievement();
  };

  const fetchUserProfile = async () => {
    const body = { id: id };
    const email = localStorage.getItem("email");
    console.log(body, email);
    // if (id != localStorage.getItem("userId")) {
    //   console.log("going to login:", id, localStorage.getItem("userId"));
    //   navigate(`/login`);
    // }
    await axios.post(APIs.API_GET_ALL_USERS).then((response) => {
      console.log(response);
      setProfile(response.data);
    });
  };

  const fetchOtherUserAchievement = async () => {
    console.log(searchUserId, tempSerch);
    axios
      .post(APIs.API_GET_ACHIEVEMENTS, { id: tempSerch })
      .then((response) => {
        console.log(response);
        setOtherAchievement(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          console.log(
            "Error 500 - Internal Server Error:",
            error.response.data
          );
        } else {
          console.error("Error occurred:", error.message);
        }
      });
  };

  const handleChange = (event) => {
    setSearchUserId(event.target.value);
  };

  const handleSearch = () => {
    fetchOtherUserAchievement();
  };

  if (achievements === null || profile === null) {
    return (
      <div className="userProfile loadingDiv">
        <Typography variant="h3">Loading Profile..</Typography>
      </div>
    );
  } else {
    return (
      <div className="Bottom">
        <Card>
          <CardContent>
            <Typography variant="h4" className="makeCenter">
              Achievements
            </Typography>
            <Grid container spacing={2} marginTop={1}>
              <Grid item xs={6}>
                <Typography variant="h6" className="makeCenter">
                  You
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    {/* <TextField
                      label="Search"
                      variant="outlined"
                      value={searchUserId ? searchUserId : `${id}`}
                      onChange={handleChange}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    /> */}
                    <div>
                      <Dropdown
                        label="Select an option"
                        options={profile}
                        value={searchUserId}
                        onChange={handleDropdownChange}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1}></Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {achievements.length == 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "gray" }}>
                      No Achievements
                    </Typography>
                  </div>
                ) : (
                  <>
                    <List>
                      {achievements.map((achievement, index) => (
                        <ListItem key={achievement}>
                          <Box
                            className="Box"
                            border={1}
                            borderRadius={4}
                            padding={2}
                            elevation={3}
                          >
                            <ListItemText primary={achievement} />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Grid>
              <Grid item xs={6}>
                {otherAchievement.length == 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "gray" }}>
                      No Achievements
                    </Typography>
                  </div>
                ) : (
                  <>
                    <List>
                      {otherAchievement.map((achievement) => (
                        <ListItem key={achievement + "other"}>
                          <Box
                            className="Box"
                            border={1}
                            borderRadius={4}
                            padding={2}
                            elevation={3}
                          >
                            <ListItemText primary={achievement} />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default Bottom;
