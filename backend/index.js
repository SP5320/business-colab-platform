const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./supaBase'); // Import the database connection
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use('/login', require('./routes/userLogin'));
app.use('/locations', require('./routes/locations'));
app.use('/teams', require('./routes/teams'));
app.use('/products', require('./routes/products'));
app.use('/repositories', require('./routes/repository'));

app.use('/search', require('./routes/search'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
