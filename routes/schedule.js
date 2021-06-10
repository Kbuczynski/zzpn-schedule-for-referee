const express = require('express');

const scheduleController = require('../controllers/schedule');

const router = express.Router();

router.get('/:searchingName', scheduleController.getAllMatches);

module.exports = router;