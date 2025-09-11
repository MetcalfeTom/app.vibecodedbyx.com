const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ARRR! POEM GENERATOR SAILING ON PORT ${PORT}!`);
});