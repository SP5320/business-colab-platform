const express = require('express');
const router = express.Router();
const userLogin = require('../controller/userLogin');

router.post('/', userLogin.login);

module.exports = router;