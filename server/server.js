require('dotenv').config();
const db = require('./config/db');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5501"
}));

const routes = require('./routes');
app.use('/api', routes);

db.init();

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));