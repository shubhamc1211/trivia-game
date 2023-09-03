import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GamePlayData() {
    const [gameplayurl, setgameplayurl] = useState(null);
    const fetchGamePlayData = async () => {
        try {
            const response = await axios.get('https://5r2e9b9pyg.execute-api.us-east-1.amazonaws.com/gameplaydata');
            setgameplayurl('https://lookerstudio.google.com/embed/reporting/d0fd7b18-3725-4234-9e1e-b81794d2cec7/page/Lk1YD');
        } catch (error) {
            console.error('Error fetching game play data:', error);
            toast.error('Failed to fetch game play data');
        }
    };

    const handleGamePlayClick = async () => {
        await fetchGamePlayData();
    };

    return (
        <Container maxWidth="md" className="leaderboardContainer">

            <Typography variant="h2" align="center" style={{ marginBottom: '20px' }}>
                Game Play and User Engagement Data
            </Typography>
            <ToastContainer />
            <Button variant="contained" className="buttonStyles" onClick={handleGamePlayClick}>
                Gameplay/User Engagement
            </Button>
            <br />
            {gameplayurl && (
                <div>
                    <Typography variant="h5" style={{ marginTop: '20px' }}>
                        Game Play and User Engagement Data
                    </Typography>
                    <iframe
                        title="Game Play and User Engagement Data"
                        width="100%"
                        height="800px"
                        src={gameplayurl}
                        frameBorder="0"
                        allowFullScreen
                        className="iframeStyles"
                    ></iframe>
                </div>
            )}
            <br />
        </Container>
    );
}