import React, { useEffect, useState } from "react";
import "./Right.css";

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import myAxios from "utils/MyAxios";
import APIs from "utils/APIs";
import axios from "axios";

const Right = ({ id }) => {
  const [teamAff, setTeamAff] = useState(null);

  useEffect(() => {
    fetchUserTeamAff();
  }, []);

  const fetchUserTeamAff = async () => {
    const body = { id: id };
    console.log(body);
    await axios
      .post(APIs.API_GET_USER_TEAMS, { userId: id })
      .then((response) => {
        const respData = JSON.parse(response.data.body);
        console.log("Teams Data:", respData.teams);
        setTeamAff(respData.teams ? respData.teams : []);
      });
  };

  // console.log("Printing last teams data", teamAff, teamAff.length);
  if (teamAff === null) {
    console.log("In team if 1");

    return (
      <div className="Teams Data loadingDiv">
        <Typography variant="h3">Loading Team Data..</Typography>
      </div>
    );
  }
  if (teamAff.length == 0) {
    console.log("In team if 2");
    return (
      <div className="Right">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" className="makeCenter">
                  Team Affiliations
                </Typography>
                <div className="scrollableContainer">
                  <Box
                    className="Box"
                    border={1}
                    borderRadius={4}
                    padding={2}
                    elevation={3}
                    maxWidth={"95%"}
                    sx={{ backgroundColor: "grey !important" }}
                  >
                    You dont have any teams yet.
                  </Box>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    console.log("In team if 3");

    return (
      <div className="Right">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" className="makeCenter">
                  Team Affiliations
                </Typography>
                <div className="scrollableContainer">
                  <List>
                    {Object.keys(teamAff).map((team) => (
                      <ListItem key={team}>
                        <Box
                          className="Box"
                          border={1}
                          borderRadius={4}
                          padding={2}
                          elevation={3}
                          // maxWidth={"95%"}
                        >
                          <ListItemText primary={teamAff[team].teamName} />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default Right;
