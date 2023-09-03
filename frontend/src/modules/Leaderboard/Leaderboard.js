import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './Leaderboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Leaderboard() {
  const [teamLeaderboardUrl, setTeamLeaderboardUrl] = useState(null);
  const [playerLeaderboardUrl, setPlayerLeaderboardUrl] = useState(null);

  const fetchTeamLeaderboard = async () => {
    try {
      const response = await axios.get('https://v8jfdq6hbk.execute-api.us-east-1.amazonaws.com/dev/leaderboard');
      setTeamLeaderboardUrl('https://lookerstudio.google.com/embed/reporting/1aec8274-f3d5-4b40-b26a-e9de7b8cbeb8/page/npbYD');
    } catch (error) {
      console.error('Error fetching team leaderboard:', error);
      toast.error('Failed to fetch team leaderboard data');
    }
  };

  const fetchPlayerLeaderboard = async () => {
    try {
      const response = await axios.get('https://v8jfdq6hbk.execute-api.us-east-1.amazonaws.com/dev/leaderboard');
      setPlayerLeaderboardUrl('https://lookerstudio.google.com/embed/reporting/59faf7b0-f40a-4145-8b46-7583fa185d41/page/mrbYD');
    } catch (error) {
      console.error('Error fetching player leaderboard:', error);
      toast.error('Failed to fetch player leaderboard data');
    }
  };

  const handleTeamLeaderboardClick = async () => {
    await fetchTeamLeaderboard();
  };

  const handlePlayerLeaderboardClick = async () => {
    await fetchPlayerLeaderboard();
  };
  
    return (
      <Container maxWidth="md" className="leaderboardContainer">
      
      <Typography variant="h2" align="center" style={{ marginBottom: '20px' }}>
        Leaderboard
      </Typography>
      <ToastContainer />
      <Button variant="contained" className="buttonStyles" onClick={handleTeamLeaderboardClick}>
        Team Statistics
      </Button>
      <br/>
      {teamLeaderboardUrl && (
        <div>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Team Details
          </Typography>
          <iframe
            title="Team Leaderboard"
            width="100%"
            height="800px"
            src={teamLeaderboardUrl}
            frameBorder="0"
            allowFullScreen
            className="iframeStyles"
          ></iframe>
        </div>
      )}
      <br/>
      <Button variant="contained" className="buttonStyles" onClick={handlePlayerLeaderboardClick}>
        Player Statistics
      </Button>

      {playerLeaderboardUrl && (
        <div>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Detailed Statistics
          </Typography>
          <iframe
            title="Player Leaderboard"
            width="100%"
            height="800px"
            src={playerLeaderboardUrl}
            frameBorder="0"
            allowFullScreen
            className="iframeStyles"
          ></iframe>
        </div>
      )}
    </Container>
  );
}
