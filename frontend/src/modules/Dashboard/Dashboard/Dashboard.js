import React from 'react';
import './Dashboard.css';
import axios from 'axios';
import APIs from 'utils/APIs';
import io from 'socket.io-client';
import { useNavigate, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getAuth, signOut } from "firebase/auth";

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = location.state || {};
    const [data, setData] = React.useState(null);
    const socket = io('http://localhost:6001', { query: "userId=klhdflkgdhglk" }); // Replace with your server URL

    const handleLogin = () => {
        axios.post(APIs.API_LOGIN, {
            username: "admin",
            password: "admin"
        }).then((response) => {
            console.log(response);
            setData(response.data);
        });
    };

    React.useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('message', message => {
            console.log('Received message:', message);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const handleSocketConnection = () => {
        const message = 'Hello from the client';
        console.log('Sending message:', message);
        socket.emit('message', message);
    };

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            // Successful logout
            navigate("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      };

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
            <Typography variant="h4">Welcome!</Typography>
            <Typography variant="body1">User ID: {userId}</Typography>
            </div>
            <p>
                {data ? JSON.stringify(data) : "No data"}
            </p>
            <button onClick={handleLogin} >
                Login
            </button>

            <button onClick={handleSocketConnection} >
                Socket Connection
            </button>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
}

export default Dashboard;
