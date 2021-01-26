const db = require('_helpers/db');
const positionService = require('position/positions.server')
const BlockIo = require('block_io');
const btc_block_io = new BlockIo('c9e7-26f8-8637-6fe6');
const doge_block_io = new BlockIo('f870-70f6-52c4-4049');
const ltc_block_io = new BlockIo('1d51-cfe4-b7e1-46a6');
const QRCode = require('qrcode');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("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");

module.exports = {
    getPositionCount,
    genQrCode,
    notificationStatus,
    getPaymentStatus,
    withdrawTest,
    getFundsHistory,
    withdrawFund,
    getPaymentInfo,
    getBalances,
    getEarnings,
    getAccountInfo,
    withdrawNotificationStatus,
    getPendingWithdraw
}

async function getPaymentStatus(req, res) {

    var positionInfo = await db.Position.findAll({
        where: {
            user_id: req.user.id
        }
    });

    if (positionInfo != undefined) {
        res.status(200).send(positionInfo);
        return;
    }
    
    res.status(400).send('Payment not paid');
}

async function notificationStatus(req, res) {
    var confirmed_number;
    var coin_api;

    res.status(200).send('success');
    // console.log('notification data', req.body.data);

    if (req.body.data) {

        const {
            network,
            address,
            balance_change,
            amount_received,
            txid,
            confirmations
        } = req.body.data;

        switch (network) {
            case 'BTC':
                coin_api = btc_block_io;
                break;
            case 'DOGE':
                coin_api = doge_block_io;
                break;
            case 'LTC':
                coin_api = ltc_block_io;
                break;
        }
        const positionInfo = await db.BuyPosition.findOne({
            where: {
                coin_address: address
            }
        });
        // console.log('here test address', address);

        if (balance_change >= 0 && confirmations == 0) {
            await db.Position.create({
                user_id: positionInfo.user_id,
                position_count: positionInfo.position_count,
                coin_type: network,
                coin_address: address,
                coin_amount: positionInfo.coin_amount,
                confirmation_number: confirmations,
                coin_balance: balance_change,
                txid: txid,
            });
        } else if (balance_change >= 0 && confirmations != 0) {
            await db.Position.update({
                confirmation_number: confirmations
            }, {
                where: {
                    txid: txid
                }
            });

            if (confirmations == 3 || confirmations == 10 || confirmations == 5) {
                setTimeout(async () => {
                    await db.Position.update({
                        confirmation_number: confirmations + 1
                    }, {
                        where: {
                            txid: txid
                        }
                    });
                }, 15000);
                const paymentInfo = await db.Position.findAll({
                    where: {
                        coin_address: address
                    }
                });
                var sum = 0;
                for (var i = 0; i < paymentInfo.length; i++) {
                    sum += paymentInfo[i].dataValues.coin_balance;
                }
                if (sum < 0) {
                    return;
                } else if (sum < positionInfo.coin_amount) {

                    var calcDif = positionInfo.coin_amount - sum;
                    // console.log('calc dif', calcDif);
                    const user = await db.User.findByPk(positionInfo.user_id);
                    const username = user.username;
                    if (!user) throw 'User not found';
                    const emailTemplate = {
                        subject: "Please confirm your Email account",
                        html: `
                        <p>Hello ${username},</p>
                        <p>Buying position failed</p>
                        <div>
                        <strong>wallet address: ${address}</strong>
                        <strong>you need to pay ${calcDif} more</strong>
                        </div>`,
                        from: "system@share2riches.com",
                        to: username
                    };
                    const sendEmail = async () => {
                        try {
                            // console.log('email template', emailTemplate);
                            const info = await sgMail.send(emailTemplate);
                            // const info = await transporter.sendMail(emailTemplate);
                            // console.log("email sent", emailTemplate);
                            return res.status(200).send(emailTemplate);
                        } catch (err) {
                            // console.log(err);
                            return res.status(500).send("Email sending error");
                        };
                    };
                    sendEmail();
                } else if (sum >= positionInfo.coin_amount) {
                    var firstloop = true;
                    const adminInfo = await db.Admin.findOne({
                        where: {
                            id: 1
                        }
                    });

                    const positionInfo = await db.BuyPosition.findOne({
                        where: {
                            coin_address: address
                        }
                    });

                    var funds = positionInfo.position_count * adminInfo.position_price;
                    var coinAmount = positionInfo.coin_amount;
                    await db.Funds.create({
                        user_id: positionInfo.user_id,
                        total_coin: coinAmount,
                        total_funds: funds,
                        position_counts: positionInfo.position_count
                    });
                    await db.AdminTransaction.create({
                        transaction_id: txid,
                        amount: funds * (adminInfo.to_admin / 100),
                        transaction_type: network,
                        user_id: positionInfo.user_id,
                    });
                    const referrerInfo = await db.MemberPayment.findOne({
                        where: {
                            id: positionInfo.user_id
                        }
                    });
                    const referrerUser = referrerInfo.referrer_users_id;
                    if (referrerUser != null) {
                        const referrerUsers = referrerUser.split(':');

                        const length = Math.min(adminInfo.level_count, referrerUsers.length - 1);
                        var referrerUserLength = referrerUsers.length - 2;
                        var affiliateLevels = adminInfo.affiliate_level_percentage;
                        affiliateLevels = affiliateLevels.split(':');
                        var affiliateLevelPercentage = 0
                        for (var i = 0; i < length; i++) {
                            // console.log('here i', i);
                            // console.log('affiliate levels', affiliateLevels);
                            // console.log('levels per aff', affiliateLevels[i]);
                            // console.log('referrer users', referrerUsers[referrerUserLength]);
                            const userInfo = await db.User.findOne({
                                where: {
                                    id: referrerUsers[referrerUserLength]
                                }
                            });
                            await db.AffiliateTransaction.create({
                                transaction_id: txid,
                                amount: funds * (affiliateLevels[i] / 100),
                                transaction_type: network,
                                user_id: positionInfo.user_id,
                                referrer_user: referrerUsers[referrerUserLength],
                                level_value: i + 1,
                                referrer_userid: userInfo.id
                            });

                            switch (network) {
                                case 'BTC':
                                    const btcMemberPayment = await db.MemberPayment.findOne({
                                        where: {
                                            id: userInfo.id
                                        }
                                    });
                                    const btcCoinAmount = btcMemberPayment.btc_amount + (funds * (affiliateLevels[i] / 100));
                                    await db.MemberPayment.update({
                                        btc_amount: btcCoinAmount
                                    }, {
                                        where: {
                                            id: userInfo.id
                                        }
                                    });
                                    break;
                                case 'LTC':
                                    const ltcMemberPayment = await db.MemberPayment.findOne({
                                        where: {
                                            id: userInfo.id
                                        }
                                    });

                                    // console.log('here id', userInfo.id);
                                    const ltcCoinAmount = ltcMemberPayment.ltc_amount + (funds * (affiliateLevels[i] / 100));
                                    // console.log('ltc coin amount', ltcCoinAmount);

                                    await db.MemberPayment.update({
                                        ltc_amount: ltcCoinAmount
                                    }, {
                                        where: {
                                            id: userInfo.id
                                        }
                                    });
                                    break;
                                case 'DOGE':
                                    const dogeMemberPayment = await db.MemberPayment.findOne({
                                        where: {
                                            id: userInfo.id
                                        }
                                    });
                                    const dogeCoinAmount = dogeMemberPayment.doge_amount + (funds * (affiliateLevels[i] / 100));
                                    await db.MemberPayment.update({
                                        doge_amount: dogeCoinAmount
                                    }, {
                                        where: {
                                            id: userInfo.id
                                        }
                                    });
                                    break;
                            }
                            affiliateLevelPercentage += parseFloat(affiliateLevels[i]);
                            // console.log('affiliate level percentage', affiliateLevelPercentage, affiliateLevels[i]);
                            referrerUserLength--;
                        }
                    }

                    // console.log('affiliate level percentage -----', affiliateLevelPercentage);
                    if (affiliateLevelPercentage == undefined) {
                        affiliateLevelPercentage = 0;
                    }

                    const restFunds = adminInfo.position_price * ((100 - adminInfo.to_admin - affiliateLevelPercentage) / 100);
                    // console.log('rest funds', restFunds);
                    const restCoinAmount = (positionInfo.coin_amount / positionInfo.position_count) * ((100 - adminInfo.to_admin - affiliateLevelPercentage) / 100);
                    for (var i = 1; i <= positionInfo.position_count; i++) {
                        await db.ApprovedPositionFunds.create({
                            user_id: positionInfo.user_id,
                            funds: restFunds,
                            coin_amount: restCoinAmount,
                            coin_type: network
                        })
                        const approvedPositionFundsInfos = await db.ApprovedPositionFunds.findAll();
                        var ApprovedPositionFundsInfo = approvedPositionFundsInfos[approvedPositionFundsInfos.length - 1];

                        var positionId = ApprovedPositionFundsInfo.id;

                        for (var j = 1; j <= adminInfo.splite_limites; j++) {
                            if (firstloop) {
                                const approvedPositionForUserId = await db.ApprovedPositionFunds.findOne({
                                    where: {
                                        id: positionId
                                    }
                                })
                                var fundHolderUserId = approvedPositionForUserId.user_id;
                                switch (network) {
                                    case 'BTC':
                                        await db.BtcFundsHolder.create({
                                            position_id: positionId,
                                            user_id: fundHolderUserId,
                                            funds: restFunds / 10,
                                            coin_amount: restCoinAmount / 10
                                        })
                                        const btcMemberPayment = await db.MemberPayment.findOne({
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        const btcCoinAmount = btcMemberPayment.btc_amount + restFunds / 10;
                                        await db.MemberPayment.update({
                                            btc_amount: btcCoinAmount
                                        }, {
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        break;
                                    case 'LTC':
                                        await db.LtcFundsHolder.create({
                                            position_id: positionId,
                                            user_id: fundHolderUserId,
                                            funds: restFunds / 10,
                                            coin_amount: restCoinAmount / 10
                                        });
                                        const ltcMemberPayment = await db.MemberPayment.findOne({
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        const ltcCoinAmount = ltcMemberPayment.ltc_amount + restFunds / 10;
                                        await db.MemberPayment.update({
                                            ltc_amount: ltcCoinAmount
                                        }, {
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        break;
                                    case 'DOGE':
                                        await db.DogeFundsHolder.create({
                                            position_id: positionId,
                                            user_id: fundHolderUserId,
                                            funds: restFunds / 10,
                                            coin_amount: restCoinAmount / 10
                                        });
                                        const dogeMemberPayment = await db.MemberPayment.findOne({
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        const dogeCoinAmount = dogeMemberPayment.doge_amount + restFunds / 10;
                                        await db.MemberPayment.update({
                                            doge_amount: dogeCoinAmount
                                        }, {
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        })
                                        break;
                                }
                                positionId++;
                                if (positionId != 1 && positionId == ApprovedPositionFundsInfo.id + 1) {
                                    positionId = 1
                                }
                            } else {
                                const approvedPositionForUserId = await db.ApprovedPositionFunds.findOne({
                                    where: {
                                        id: positionId - 1
                                    }
                                })
                                var fundHolderUserId = approvedPositionForUserId.user_id;
                                switch (network) {
                                    case 'BTC':
                                        await db.BtcFundsHolder.create({
                                            position_id: positionId - 1,
                                            user_id: fundHolderUserId,
                                            funds: restFunds / 10,
                                            coin_amount: restCoinAmount / 10
                                        });
                                        const btcMemberPayment = await db.MemberPayment.findOne({
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        const btcCoinAmount = btcMemberPayment.btc_amount + restFunds / 10;
                                        await db.MemberPayment.update({
                                            btc_amount: btcCoinAmount
                                        }, {
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        break;
                                    case 'LTC':
                                        await db.LtcFundsHolder.create({
                                            position_id: positionId - 1,
                                            user_id: fundHolderUserId,
                                            funds: restFunds / 10,
                                            coin_amount: restCoinAmount / 10
                                        })
                                        const ltcMemberPayment = await db.MemberPayment.findOne({
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        const ltcCoinAmount = ltcMemberPayment.ltc_amount + restFunds / 10;
                                        await db.MemberPayment.update({
                                            ltc_amount: ltcCoinAmount
                                        }, {
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        break;
                                    case 'DOGE':
                                        await db.DogeFundsHolder.create({
                                            position_id: positionId - 1,
                                            user_id: fundHolderUserId,
                                            funds: restFunds / 10,
                                            coin_amount: restCoinAmount / 10
                                        })
                                        const dogeMemberPayment = await db.MemberPayment.findOne({
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        });
                                        const dogeCoinAmount = dogeMemberPayment.doge_amount + restFunds / 10;
                                        await db.MemberPayment.update({
                                            doge_amount: dogeCoinAmount
                                        }, {
                                            where: {
                                                id: fundHolderUserId
                                            }
                                        })
                                        break;
                                }
                                if (positionId != 1 && positionId == ApprovedPositionFundsInfo.id + 1) {
                                    positionId = 1
                                }
                                positionId++;
                            }
                        }
                        firstloop = false;
                    }
                }
            }
        } else {
            return;
        }
    }
}

async function getFundsHistory(req, res) {
    const data = await db.fundsHolder.findAll({
        where: {
            user_id: req.user.id
        }
    })
    res.status(200).send(data);
}

async function genQrCode(req, res) {
    var price_perposition = await positionService._getPositionPrice();
    const {
        amounts,
        cointype,
        id
    } = req.body;
    var coin_api;
    var coin_address;
    var coin_amount;
    var position_price;
    // console.log(price_perposition);

    switch (cointype) {
        case 'btc':
            position_price = price_perposition.btc_price;
            coin_address = await btc_block_io.get_new_address();
            coin_api = btc_block_io;
            break;
        case 'doge':
            position_price = price_perposition.doge_price;
            coin_address = await doge_block_io.get_new_address();
            coin_api = doge_block_io;
            break;
        case 'ltc':
            position_price = price_perposition.ltc_price;
            coin_address = await ltc_block_io.get_new_address();
            coin_api = ltc_block_io;
            break;
    };
    coin_address = coin_address.data.address;
    // console.log('coin address', coin_address);
    // console.log('price_per', position_price);
    coin_amount = position_price * amounts;
    const coin_data = cointype + ':' + coin_address + '?' + 'amount=' + coin_amount;

    // console.log(coin_data);
    QRCode.toDataURL(coin_data, async (err, dataURL) => {
        const data = {
            "dataUrl": dataURL.toString(),
            "cointype": cointype,
            "coinaddress": coin_address,
            "amount": coin_amount,
            "data": coin_data,
        };
        // console.log(data);
        res.status(200).send(data);
    });
    const buyPosition = await db.BuyPosition.create({
        user_id: id,
        position_count: amounts,
        coin_type: cointype,
        coin_address: coin_address,
        coin_amount: coin_amount,
    });
    // console.log('buy position', buyPosition);
    const notificationUrl = 'http://share2riches.com:8880/coins/notification';
    coin_api.create_notification({
        type: 'address',
        address: coin_address,
        url: notificationUrl
    });
}
async function getPositionCount(req, res) {
    const id = req.params.id;
    const position = await db.Position.findAll({
        where: {
            user_id: id
        }
    })
    var total_amount = 0;
    position.forEach(function (obj) {
        total_amount += obj.position_count;
        // console.log(obj.position_count);
    });
    // console.log(total_amount);
    return res.status(200).send(total_amount.toString());
}

async function withdrawTest(req, res) {
    await ltc_block_io.withdraw({
        pin: '2Wsxzaq16599X',
        to_address: 'LX7oQDgURf9Q16cRsTQZyUde4SPYsKG3ZS',
        amount: req.body.amounts
    });
    return res.status(200).send(req.body);
}

async function withdrawNotificationStatus(req, res) {
    // console.log('withdraw notification data', req.body.data);
}

async function withdrawFund(req, res) {

    const pinCode = '2Wsxzaq16599X';
    const {
        coinType,
        amount
    } = req.body;
    var convertCoin = await positionService._getPositionPrice();

    // console.log('req body', req.body.coinType);

    const memberPaymentInfo = await db.MemberPayment.findOne({
        where: {
            id: req.user.id
        }
    });

    const paymentProcessingInfo = await db.Admin.findOne({
        where: {
            id: 1
        }
    });

    // console.log('coin type', coinType);
    if (amount < paymentProcessingInfo.minimum_withdraw_amount)
        return res.status(500).send({ message: 'withdrawal minimum amount is ' + paymentProcessingInfo.minimum_withdraw_amount });
    if (amount > paymentProcessingInfo.maximum_withdraw_amount)
        return res.status(500).send({ message: 'withdrawal maximum amount is ' + paymentProcessingInfo.maximum_withdraw_amount });

    try {
        switch (coinType) {
            case 'BTC':
                const btcRestAmount = memberPaymentInfo.btc_amount - amount;
                const btcWalletAddress = req.user.btc_wallet_address;
                if (btcRestAmount >= 0) {
                    await btc_block_io.withdraw({
                        pin: pinCode,
                        to_address: btcWalletAddress,
                        amount: amount * convertCoin.btc_rating
                    });
                    btc_block_io.create_notification({ type: 'account', url: 'http://share2riches.com:8880/coins/withdraw-notificationf' });

                    await db.MemberPayment.update({
                        btc_amount: btcRestAmount
                    }, {
                        where: {
                            id: req.user.id
                        }
                    });
                } else {
                    const btcAmountErrorReq = {
                        message: 'Please check your withdraw available balance'
                    }
                    return res.status(400).send(btcAmountErrorReq);
                }
                break;
            case 'LTC':
                const ltcWalletAddress = req.user.ltc_wallet_address;
                const ltcRestAmount = memberPaymentInfo.ltc_amount - amount;
                if (ltcRestAmount >= 0) {
                    await ltc_block_io.withdraw({
                        pin: pinCode,
                        to_address: ltcWalletAddress,
                        amount: amount * convertCoin.ltc_rating
                    });
                    ltc_block_io.create_notification({ type: 'account', url: 'http://share2riches.com:8880/coins/withdraw-notificationf' });
                    await db.MemberPayment.update({
                        ltc_amount: ltcRestAmount
                    }, {
                        where: {
                            id: req.user.id
                        }
                    });
                } else {
                    const ltcAmountErrorReq = {
                        message: 'Please check your withdraw available balance'
                    }
                    return res.status(400).send(ltcAmountErrorReq);
                }
                break;
            case 'DOGE':
                const dogeWalletAddress = req.user.doge_wallet_address;
                const dogeRestAmount = memberPaymentInfo.doge_amount - amount;
                if (dogeRestAmount >= 0) {
                    await ltc_block_io.withdraw({
                        pin: pinCode,
                        to_address: dogeWalletAddress,
                        amount: amount * convertCoin.doge_rating
                    });
                    doge_block_io.create_notification({ type: 'account', url: 'http://share2riches.com:8880/coins/withdraw-notificationf' });
                    await db.MemberPayment.update({
                        doge_amount: dogeRestAmount
                    }, {
                        where: {
                            id: req.user.id
                        }
                    });
                } else {
                    const dogeAmountErrorReq = {
                        message: 'Please check your withdraw available balance'
                    }
                    return res.status(400).send(dogeAmountErrorReq);
                }
                break;
        }
        await db.Withdraw.create({
            withdraw_funds: amount,
            coin_type: coinType,
            user_id: req.user.id
        });
        const reqData = {
            message: 'Successfully withdrawed'
        };
        return res.status(200).send(reqData);
    } catch (err) {
        // console.log('here withdraw err', err);
        const reqErrorData = {
            message: err.toString()
        };
        // console.log('req error data', reqErrorData)
        await db.Withdraw.create({
            withdraw_funds: amount,
            coin_type: coinType,
            user_id: req.user.id,
            withdraw_status: reqErrorData
        });
        return res.status(500).send(reqErrorData);
    }
}

async function getPendingWithdraw(req, res) {
    const withdrawInfo = await db.PendingWithdraw.findAll();

}

async function getPaymentInfo(req, res) {
    try {
        const paymentInfo = await db.Admin.findOne({
            where: {
                id: 1
            }
        });
        // console.log('payment info', paymentInfo);
        const pricePerPosition = paymentInfo.position_price;
        const adminTransactionInfo = await db.AdminTransaction.findAll();
        var totalAdminFee = 0;
        for (var i = 0; i < adminTransactionInfo.length; i++) {
            var obj = adminTransactionInfo[i];
            totalAdminFee += obj.amount;
        }
        const affiliateTransactionInfo = await db.AffiliateTransaction.findAll();
        var totalAffiliateFee = 0;
        for (var i = 0; i < affiliateTransactionInfo.length; i++) {
            var obj = affiliateTransactionInfo[i];
            totalAffiliateFee += obj.amount;
        }

        const resData = {
            pricePerPosition: pricePerPosition,
            totalAdminFee: totalAdminFee,
            totalAffiliateFee: totalAffiliateFee
        }
        res.status(200).send(resData);
    } catch (err) {
        // console.log('payment info error', err);
        res.status(500).send(err);
    }
}

async function getBalances(req, res) {
    try {
        const coinBalance = await db.MemberPayment.findOne({
            where: {
                id: req.user.id
            }
        });
        return res.status(200).send(coinBalance);
    } catch (err) {
        // console.log(err);
    }
}

async function getEarnings(req, res) {
    const fundsInfo = await db.Funds.findAll({
        where: {
            user_id: req.user.id
        }
    });
    var mainFunds = 0;
    for (var i = 0; i < fundsInfo.length; i++) {
        var obj = fundsInfo[i];
        mainFunds += obj.total_funds;
    }
    // console.log('main funds', mainFunds);
    const earningFundsInfo = await db.MemberPayment.findOne({
        where: {
            id: req.user.id
        }
    });
    var earningFunds = earningFundsInfo.btc_amount + earningFundsInfo.ltc_amount + earningFundsInfo.doge_amount
    const withdrawInfo = await db.Withdraw.findAll({
        where: {
            user_id: req.user.id
        }
    });
    var withdrawFunds = 0;
    for (var i = 0; i < withdrawInfo.length; i++) {
        var obj = withdrawInfo[i];
        withdrawFunds += obj.withdraw_funds;
    }

    const affiliateTransactionInfo = await db.AffiliateTransaction.findAll({
        where: {
            referrer_user: req.user.referral_id
        }
    });
    var affiliateFunds = 0;
    for (var i = 0; i < affiliateTransactionInfo.length; i++) {
        var obj = affiliateTransactionInfo[i];
        affiliateFunds += obj.amount;
    }
    const profitFromPosition = earningFunds + withdrawFunds - affiliateFunds - mainFunds;
    const totalProfit = profitFromPosition + affiliateFunds;
    const resData = {
        totalPositionProfit: profitFromPosition,
        totalAffiliateProfit: affiliateFunds,
        totalProfit: totalProfit
    };

    return res.status(200).send(resData);
}

async function getAccountInfo(req, res) {
    const fundsInfo = await db.Funds.findAll({
        where: {
            user_id: req.user.id
        }
    });
    var positionCount = 0;
    for (var i = 0; i < fundsInfo.length; i++) {
        var obj = fundsInfo[i];
        positionCount += obj.position_counts;
    }
    const positionAmount = await db.MemberPayment.findOne({
        where: {
            id: req.user.id
        }
    });
    var totalPositionAmount = positionAmount.btc_amount + positionAmount.ltc_amount + positionAmount.doge_amount;
    const withdrawInfo = await db.Withdraw.findAll({
        where: {
            user_id: req.user.id
        }
    });
    var withdrawAmount = 0;
    for (var i = 0; i < withdrawInfo.length; i++) {
        var obj = withdrawInfo[i];
        withdrawAmount += obj.withdraw_funds;
        // console.log('withdraw each', obj.withdraw_funds);
    }
    const resData = {
        positionCounts: positionCount,
        totalPositionAmount: totalPositionAmount,
        withdrawAmount: withdrawAmount
    }
    return res.status(200).send(resData);
}