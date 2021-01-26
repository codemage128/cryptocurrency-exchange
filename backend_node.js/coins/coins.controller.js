const { Router } = require('express');
const express = require('express');
const router = express.Router();
const coinService = require('./coins.service');
const authorize = require('_middleware/authorize');
const coinsService = require('./coins.service');

router.get('/get-positioncount/:id', coinService.getPositionCount);
router.post('/genqrcode', coinService.genQrCode);
router.post('/notification', coinService.notificationStatus);
router.post('/withdraw-notification', coinService.withdrawNotificationStatus);
router.post('/paymentstatus', authorize(), coinService.getPaymentStatus);
router.post('/withdrawtest', coinService.withdrawTest);
router.get('/getfundshistory', authorize(), coinService.getFundsHistory);
router.post('/withdraw', authorize(), coinService.withdrawFund);
router.get('/get-pendingwithdraw', authorize(), coinsService.getPendingWithdraw);
router.get('/get-paymentsetting', authorize(), coinService.getPaymentInfo);
router.get('/get-membercoinbalance', authorize(), coinService.getBalances);
router.get('/get-memberearnings', authorize(), coinService.getEarnings);
router.get('/get-accountinfo', authorize(), coinService.getAccountInfo);

module.exports = router;
