/**
 * This file will run the frontend code through express server.
 * 
 * @Author Rahul Saliya
 */
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    const file = path.join(__dirname, 'build', 'index.html');
    res.sendFile(file);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
