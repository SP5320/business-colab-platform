const express = require('express');
const router = express.Router();

const teams = require('../controller/teams');

// Route to get all teams
router.get('/', teams.getTeams);
module.exports = router;