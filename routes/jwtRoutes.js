const express = require('express');
const JwtController = require('../controllers/jwtController');
const router = express.Router();

router.get('/', JwtController.getToken);

module.exports = router;