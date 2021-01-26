const db = require('_helpers/db');
let price = require('crypto-price');

module.exports = {
    _getPositionPrice,
    getPositionPrice,
    updatePositionPrice,
    updateSpliteAmounts,
    getSpliteAmounts,
    updateSpliteLimites,
    addPosition
}
async function addPosition(req, res) {
    if (req.user.id != 1)
        return false;
    const { username, positionAmount } = req.body;
    const checkUser = await db.User.findOne({
        where: {
            username
        }
    });
    if (checkUser == null) {
        const errorReq = {
            message: 'User does not exist'
        };
        return res.status(400).send(errorReq);
    }
    const successReq = {
        message: 'Position successfully added!'
    };
    return res.status(400).send(errorReq);
}

async function updateSpliteLimites(req, res) {
    // console.log('req uesr for update splite amounts', req.user.id);
    const { splite_limits } = req.body;
    if (req.user.id == 1) {
        const admin = await db.Admin.findOne({
            where: {
                id: 1
            }
        });
        await db.Admin.update({
            splite_limites: splite_limits,
        }, {
            where: {
                id: 1
            }
        });
        return res.status(200).send(admin);
    } else {
        return res.status(400).send('update failed');
    }
}
async function updateSpliteAmounts(req, res) {
    // console.log('req uesr for update splite amounts', req.user.id);
    const { to_admin, to_affiliates } = req.body;
    if (req.user.id == 1) {
        const admin = await db.Admin.findOne({
            where: {
                id: 1
            }
        });
        await db.Admin.update({
            to_admin: to_admin,
            to_affiliates: to_affiliates
        }, {
            where: {
                id: 1
            }
        });
        return res.status(200).send(admin);
    } else {
        return res.status(400).send('update failed');
    }
}

async function getSpliteAmounts(req, res) {
    const getSpliteAmounts = await db.Admin.findOne({
        where: {
            id: 1
        }
    });
    return res.status(200).send(getSpliteAmounts);
}

async function _getPositionPrice(req, res) {
    const positionPriceInfo = await db.Admin.findOne({
        where: {
            id: 1
        }
    });
    var rating = [];
    const positionPrice = await positionPriceInfo.position_price;
    const cointype = ['btc', 'doge', 'ltc'];
    // console.log(cointype[1]);
    for (var i = 0; i <= 2; i++) {
        await price.getBasePrice('usd', cointype[i]).then(obj => {
            rating.push(obj.price);
        }).catch(err => {
            // console.log(err);
        })
    }
    const convert_coin = {
        origin_price: positionPrice,
        btc_rating: rating[0],
        doge_rating: rating[1],
        ltc_rating: rating[2],
        btc_price: positionPrice * rating[0],
        doge_price: positionPrice * rating[1],
        ltc_price: positionPrice * rating[2]
    };
    // console.log('convert coin', convert_coin);
    return convert_coin;
}

async function getPositionPrice(req, res) {
    const price_perposition = await _getPositionPrice();
    return res.send(price_perposition);
}

async function updatePositionPrice(req, res) {
    const position_price = req.params.price;
    // console.log('req uesr', req.user.id);
    if (req.user.id == 1) {
        const admin = await db.Admin.findOne({
            where: {
                id: 1
            }
        });
        if (!admin) {
            await db.Admin.create({
                position_price: position_price
            });
        }
        await db.Admin.update({
            position_price: position_price
        }, {
            where: {
                id: 1
            }
        });
        return res.send(position_price.toString());
    } else {
        return res.status(400).send('update failed');
    }
}