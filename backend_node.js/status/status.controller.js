const { Router } = require('express');
const express = require('express');
const router = express.Router();
const statusService = require('./status.service');
const authorize = require('_middleware/authorize');

router.post('/global-info', statusService.getGlobalInfo);

module.exports = router;