const express = require('express');
const router = express.Router();
const positionServer = require('./positions.server');
const authorize = require('_middleware/authorize');

router.get('/getpositionprice', positionServer.getPositionPrice);
router.post('/updatepositionprice/:price', authorize(), positionServer.updatePositionPrice);
router.post('/updatespliteamounts', authorize(), positionServer.updateSpliteAmounts);
router.post('/updatesplitelimits', authorize(), positionServer.updateSpliteLimites);
router.get('/getspliteamounts', positionServer.getSpliteAmounts);
router.post('/add-position', authorize(), positionServer.addPosition);

module.exports = router;