import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Left from "components/Profile/Left/index.js";
import Right from "components/Profile/Right/index.js";
import Bottom from "components/Profile/Bottom/index.js";
import { Grid, Typography } from "@mui/material";
import "./UserProfile.css";

const UserProfile = () => {
  const { id } = useParams();
  const [searchUserId, setSearchUserId] = useState(null);

  // if (profile === null || profileImage === null) {
  //   return (
  //     <div className="userProfile loadingDiv">
  //       <Typography variant="h3">Loading Profile..</Typography>
  //     </div>
  //   );
  // } else {
  return (
    <div className="userProfile">
      <Grid container spacing={2}>
        <div className="header">
          <Grid item xs={12}>
            {/* <Typography variant="h3">User Profile Management</Typography> */}
          </Grid>
        </div>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Left id={id} />
            </Grid>
            <Grid item xs={6}>
              <Right id={id} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid item xs={12}>
            <Bottom
              id={id}
              searchUserId={searchUserId}
              setSearchUserId={setSearchUserId}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
//};

export default UserProfile;
