const config = require('config.json');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const { ref } = require('joi');

module.exports = {
    authenticate,
    getAll,
    getAllNames,
    getById,
    create,
    update,
    delete: _delete,
    forgot_password,
    reset_password,
    update_tfa,
    update_alltfa_false,
    update_alltfa_true,
    update_alletfa_false,
    update_alletfa_true,
    pinSave,
    sendCode,
    verifyCode,
    updatePaymentSetting,
    setReferrer,
    getByReferrerId,
    reinvestSetting,
    getAdminInfo,
    getReinvestInfo,
    setAdminPinCode,
    getAdminPinCode,
    pinCodeCheck,
    getDownlineStatus,
    usersByLevel,
    setPaymentProcessing
};
let r;
async function getByReferrerId(req, res) {
    const userInfo = await db.User.findOne({
        where: {
            referral_id: req.params.referrer_id
        }
    });
    const fullName = userInfo.firstName + ' ' + userInfo.lastName;
    const reqData = {
        fullName: fullName
    };
    return res.status(200).send(reqData);
}
async function sendCode(req, res) {
    let username = req.params.username;
    r = Math.random().toString(36).substring(7);
    // console.log("random", r);
    const emailTemplate = {
        subject: "Please confirm your Email account",
        html: `
            <p>Hello ${username},</p>
            <p>Please confirm below code to verify your email</p>
            <div>
            <strong>${r}</strong>
            </div>`,
        from: "system@share2riches.com",
        to: username
    };

    const sendEmail = async () => {
        try {
            // console.log('email template', emailTemplate)
            const info = await sgMail.send(emailTemplate);
            // const info = await transporter.sendMail(emailTemplate);
            // console.log("email sent", emailTemplate);
            return res.status(200).send("Email sent");
        } catch (err) {
            // console.log(err);
            return res.status(500).send("Email sending error");
        };
    };
    sendEmail();
}
async function verifyCode(req, res) {
    const verifycode = req.body.verifycode;
    // console.log('verifycode, randomeocode', verifycode, r, req.body);
    if (verifycode === r) {
        return res.status(200).send('success');
    }
    return res.status(400).send('code is invalid');
}
async function pinSave(req, res) {
    const pinCode = req.body.pincode;
    const username = req.user.username;
    await db.User.update({
        pinCode: pinCode
    }, {
        where: {
            username
        }
    });
    const resData = {
        updatedPinCode: pinCode
    }
    return res.status(200).send(resData);
}

async function authenticate({username,password} ) {
    const user = await db.User.scope('withHash').findOne({
        where: {
            username
        }
    });
    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';
    const token = jwt.sign({
        sub: user.id
    }, config.secret, {
        expiresIn: '15d'
    });
    return {
        ...omitHash(user.get()),
        token
    };
}

async function tfa_authenticate(req, res) {
    if (!req.headers['x-tfa']) {
        // console.log(`WARNING: Login was partial without TFA header`);

        return res.send({
            "status": 206,
            "message": "Please enter the Auth Code"
        });
    }
    if (isVerified) {
        // console.log(`DEBUG: Login with TFA is verified to be successful`);

        return res.send({
            "status": 200,
            "message": "success"
        });
    } else {
        // console.log(`ERROR: Invalid AUTH code`);

        return res.send({
            "status": 206,
            "message": "Invalid Auth Code"
        });
    }
}

async function getAll() {
    return await db.User.findAll();
}

async function getAllNames(req, res) {
    const id = req.params.id;
    usersInfo = await db.User.findAll();
    var resData = [];
    usersInfo.forEach((item, index) => {
        if (index == 0 || index == id - 1) {
            // console.log('display index', index);
        } else {
            resData.push({ name: item.firstName + ' ' + item.lastName, id: index + 1 });
        }
    })
    return res.status(200).send(resData);
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({
        where: {
            username: params.username
        }
    })) {
        throw 'Username "' + params.username + '" is already taken';
    }
    let tfa_allow = false
    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    const randomString = Math.random().toString(36).substr(2, 5);
    // console.log("params-->", params);
    params.referral_id = randomString;
    // save user
    await db.User.create(params);
    await db.MemberPayment.create({
        btc_amount: 0,
        ltc_amount: 0,
        doge_amount: 0,
        referrer_id: params.referral_id
    })
}

async function update(id, params) {
    const user = await getUser(id);
    var WAValidator = require('multicoin-address-validator');
    // console.log('here params', params);
    if (params.btc_wallet_address) {
        var btcValid = await WAValidator.validate(params.btc_wallet_address, 'BTC');
        if (btcValid) {
            // console.log('This is a valid bitcoin address');
        } else {
            // console.log('Bitcoin Address INVALID');
            const btcReq = {
                message: 'Bitcoin Address INVALID'
            };
            return btcReq;
        }
    }
    if (params.ltc_wallet_address) {
        var ltcValid = await WAValidator.validate(params.ltc_wallet_address, 'LTC');
        if (ltcValid) {
            // console.log('This is a valid litecoin address');
        } else {
            // console.log('Litecoin Address INVALID');
            const ltcReq = {
                message: 'Litecoin Address INVALID'
            };
            return ltcReq;
        }
    }
    if (params.doge_wallet_address) {
        var dogeValid = await WAValidator.validate(params.doge_wallet_address, 'DOGE');
        if (dogeValid) {
            // console.log('This is a valid dogecoin address');
        } else {
            // console.log('Dogecoin Address INVALID');
            const dogeReq = {
                message: 'Dogecoin Address INVALID'
            };
            return dogeReq;
        }
    }
    if (params.referral_id) {
        const checkUser = await db.User.findOne({
            where: {
                referral_id: params.referral_id
            }
        })
        // console.log('check user', checkUser);
        if (checkUser != null) {
            const errorReq = {
                message: 'The Referral Name Already Exist!'
            };
            return errorReq;
        }
        // console.log('referral id', params.referral_id, 'id: ', id);
        await db.MemberPayment.update({
            referrer_id: params.referral_id
        }, {
            where: {
                id: id
            }
        })
    }
    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({
        where: {
            username: params.username
        }
    })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function updatePaymentSetting(req, res) {
    const {
        positionPrice,
        adminFee,
        levelNumber,
        affiliatePercentage,
        splitNumber
    } = req.body;
    if (req.user.id == 1) {
        await db.Admin.update({
            position_price: positionPrice,
            to_admin: adminFee,
            splite_limites: splitNumber,
            level_count: levelNumber,
            affiliate_level_percentage: affiliatePercentage,
        }, {
            where: {
                id: 1
            }
        });
        const adminInfo = await db.Admin.findOne({
            where: {
                id: 1
            }
        })
        return res.send(adminInfo);
    } else {
        return res.status(400).send('authentication failed');
    }
}
async function reinvestSetting(req, res) {
    const { admin_fee, member_amount, referral_commission } = req.body;
    // console.log('body params', admin_fee, member_amount, referral_commission);
    if (req.user.id == 1) {
        // console.log('here admin side');
        try {
            const checkReinvest = await db.Reinvest.findOne();
            // console.log('check reinvest', checkReinvest);
            // console.log('check reinvest', typeof (checkReinvest));
            if (checkReinvest == null) {
                // console.log('here if');
                await db.Reinvest.create({
                    admin_fee: admin_fee,
                    member_amount: member_amount,
                    referral_commission: referral_commission
                })
            } else {
                // console.log('here else');
                await db.Reinvest.update({
                    admin_fee: admin_fee,
                    member_amount: member_amount,
                    referral_commission: referral_commission
                }, {
                    where: {
                        id: 1
                    }
                });
            }
            const reinvestInfo = await db.Reinvest.findOne({
                where: {
                    id: 1
                }
            })
            return res.status(200).send(reinvestInfo);

        } catch (error) {
            // console.log('error', error);
            return res.status(500).send('update reinvest failed');
        }
    } else {
        // console.log('authorization error');
    }
}

async function setAdminPinCode(req, res) {
    const pinCode = req.body.pincode;
    await db.User.update({
        pinCode: pinCode
    }, {
        where: {
            id: 1
        }
    });
    const resData = {
        updatedPinCode: pinCode
    }
    return res.status(200).send(resData);
}

async function getAdminInfo(req, res) {
    const adminInfo = await db.Admin.findOne({
        where: {
            id: 1
        }
    });
    if (req.user.id == 1) {
        return res.status(200).send(adminInfo);
    }
    res.status(400).send('authentication failed');
}

async function getReinvestInfo(req, res) {
    const reinvestInfo = await db.Reinvest.findOne({
        where: {
            id: 1
        }
    });
    if (req.user.id == 1) {
        return res.status(200).send(reinvestInfo);
    }
    return res.status(400).send('unauthorized');
}

async function getAdminPinCode(req, res) {
    const adminInfo = await db.User.findOne({
        where: {
            id: 1
        }
    });
    const pinCode = adminInfo.pinCode;
    if (pinCode == null)
        return 'pin code was not setted';
    if (pinCode == req.params.pincode)
        return res.status(200).send(adminInfo);

    const errorRes = {
        message: 'Pin code doesn`t matched'
    }
    return res.status(500).send(errorRes);
}

async function pinCodeCheck(req, res) {
    const pinCode = req.params.pinCode;
    if (pinCode == req.user.pinCode)
        return res.status(200).send({ message: 'success' });
    return res.status(500).send({ message: 'Pin code does not matched' });
}

async function update_tfa(req, res) {
    await db.User.update({
        tfa_allow
    });
}

async function update_alltfa_false(req, res) {
    await db.User.update({
        tfa_allow: false
    }, {
        where: {
            tfa_allow: true
        }
    });
    return res.status(200).send('success');
}

async function update_alltfa_true(req, res) {
    await db.User.update({
        tfa_allow: true
    }, {
        where: {
            tfa_allow: false
        }
    });
    return res.status(200).send('success');
}
async function update_alletfa_false(req, res) {
    await db.User.update({
        etfa_allow: false
    }, {
        where: {
            etfa_allow: true
        }
    });
    return res.status(200).send('success');
}

async function update_alletfa_true(req, res) {
    await db.User.update({
        etfa_allow: true
    }, {
        where: {
            etfa_allow: false
        }
    });
    return res.status(200).send('success');
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const {
        hash,
        ...userWithoutHash
    } = user;
    return userWithoutHash;
}
// Init email config
const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    // port: 465,
    port: 587,
    secure: true, // use TLS
    // ssl: true,
    auth: {
        user: "system@share2riches.com",
        pass: "uQmgy62aevYKfMEk3g5wDxYP"
    }
    // host: "smtp.gmail.com",
    // port: 587,
    // // ssl: true,
    // secure: false,
    //  auth: {
    //   user: "baymax.development@gmail.com",
    //   pass: "sbaetyffyhzjscgk"
    // }
});

async function forgot_password(req, res) {
    let user;
    // console.log(req.params.username);
    try {
        user = await db.User.findOne({
            where: {
                username: req.params.username
            }
        });
    } catch (err) {
        return res.status(404).send("Error reading from database");
    }
    if (!user) {
        return res.status(404).send("Email never registered");
    }
    //Generate one-time use URL with jwt token
    const secret = `${user.password}-${user.createAt}`;
    const token = jwt.sign({
        id: user.id
    }, secret, {
        expiresIn: 3600 //expires in 1 hour
    });
    const url = `http://app.share2riches.com/#/authentication/reset-password/${user.id}/${token}`;
    const emailTemplate = {
        subject: "Password Reset Request",
        html: `
            <p>Hello ${user.username},</p>
            <p>You recently requested to reset your password.</p>
            <p>Click the following link to finish resetting your password.</p>
            <a type="button" href=${url}>${url}</a>`,
        from: "system@share2riches.com",
        to: user.username
    };

    const sendEmail = async () => {
        try {
            const info = await sgMail.send(emailTemplate);
            // const info = await transporter.sendMail(emailTemplate);
            // console.log("email sent", emailTemplate);
            return res.status(200).send("Email sent");
        } catch (err) {
            // console.log(err);
            return res.status(500).send("Email sending error");
        }
    };
    sendEmail();
};

async function reset_password(req, res) {
    const {
        id,
        token
    } = req.params;
    // console.log("reset password");
    const {
        password
    } = req.body
    // console.log("password--", password);
    let user;
    try {
        user = await db.User.findOne({
            where: {
                id
            }
        });
        // console.log("here user", user);
    } catch (err) {
        // console.log(err);
        return res.status(404).send("Error reading database");
    }
    if (!user) return res.status(404).send("No user with that id");
    // Generate secret token
    const secret = `${user.password}-${user.createAt}`;
    //Verify that token is valid
    const payload = jwt.decode(token, secret);
    // console.log("payload", payload);
    if (!payload) {
        return res.status(404).send("Invalid id or token");
    }
    if (payload.id != id) {
        return res.status(404).send("Invalid id or token");
    }
    //Hash new password and store in database
    // const salt = await bcrypt.genSalt(10);
    new_password = await bcrypt.hash(password, 10);
    user = await db.User.update({
        hash: new_password
    }, {
        where: {
            id
        }
    })
    // console.log("user.password", new_password);
    return res.status(200).send("Password Reset Success!");
}

async function setReferrer(req, res) {
    // console.log('req body', req.body);
    const referrerUserInfo = await db.User.findOne({
        where: {
            referral_id: req.body.refUsername
        }
    });
    const referrerInfo = await db.MemberPayment.findOne({
        where: {
            id: referrerUserInfo.id
        }
    });

    // console.log('referrer user', referrerInfo.referrer_users_id);

    var newRef;
    if (referrerInfo.referrer_users_id == null) {
        newRef = referrerUserInfo.id + ':';
    } else {
        newRef = referrerInfo.referrer_users_id + referrerUserInfo.id + ':';
    }
    // console.log('new ref', newRef);

    const newUserInfo = await db.User.findOne({
        where: {
            username: req.body.username
        }
    });

    // console.log('user id: ', newUserInfo.id);
    await db.MemberPayment.update({
        referrer_users_id: newRef
    }, {
        where: {
            id: newUserInfo.id
        }
    });
    const refArray = newRef.split(':');
    refArray.forEach(async (item, index) => {
        // console.log('index: ', index, 'item: ', item);
        if (item == '') {
            // console.log('blank string', item);
        } else if (item == null) {
            // console.log('null string', item);
        } else if (item == NaN) {
            // console.log('item NaN', item);
        } else if (parseInt(item) == NaN) {
            // console.log('parse int item Nan', item)
        }
        if (item != '') {
            const userInfoByReferrer = await db.MemberPayment.findOne({
                where: {
                    id: parseInt(item)
                }
            });
            // console.log('test index: ', index, 'test item: ', parseInt(item));
            // console.log('item type', typeof (parseInt(item)));
            // console.log('referrer buy user: ', userInfoByReferrer);
            if (userInfoByReferrer.referrer_byuser == null) {
                await db.MemberPayment.update({
                    referrer_byuser: req.body.username
                }, {
                    where: {
                        id: parseInt(item)
                    }
                })
            } else {
                await db.MemberPayment.update({
                    referrer_byuser: userInfoByReferrer.referrer_byuser + ':' + req.body.username
                }, {
                    where: {
                        id: parseInt(item)
                    }
                })
            }
        }
    })
}

async function usersByLevel(req, res) {
    const memberInfo = await db.MemberPayment.findOne({
        where: {
            id: req.user.id
        }
    });
    const str = memberInfo.referrer_byuser;
    if (str == null)
        return res.status(200).send({ levelCount: 0 });
    if (!str.includes(':'))
        return res.status(200).send({ levelCount: 1 });

    const referrerArray = memberInfo.referrer_byuser.split(':');
    return res.status(200).send({ levelCount: referrerArray.length });
}

async function getDownlineStatus(req, res) {
    const memberInfo = await db.MemberPayment.findOne({
        where: {
            id: req.user.id
        }
    });
    const referrerUsers = memberInfo.referrer_byuser;
    var email;

    if (memberInfo.referrer_byuser == null)
        return 0;
    if (!referrerUsers.includes(':')) {
        email = referrerUsers;
    } else {
        email = referrerUsers.split(':')[req.params.value - 1];
    }
    const referrerMemberInfo = await db.User.findOne({
        where: {
            username: email
        }
    });
    const affiliateInfo = await db.AffiliateTransaction.findAll({
        where: {
            referrer_user: req.user.referral_id,
            level_value: req.params.value - 1
        }
    });
    var totalEarning = 0;
    if (affiliateInfo != []) {
        affiliateInfo.forEach(function (obj) {
            totalEarning += obj.amount;
            // console.log('total earning debig', obj.amount, totalEarning);
        });
    }
    var totalPurchasedShares = 0;
    const purchasedFunds = await db.ApprovedPositionFunds.findAll({
        where: {
            user_id: req.user.id
        }
    });
    purchasedFunds.forEach(function (obj) {
        totalPurchasedShares += obj.funds;
    })
    var totalReinvestedShares = 0;
    var resData = {
        no: req.params.value,
        username: referrerMemberInfo.firstName + ' ' + referrerMemberInfo.lastName,
        totalEarningAmount: totalEarning,
        totalPurchasedShares: totalPurchasedShares,
        totalReinvestedShares: 0,
        email: email
    }
    return res.status(200).send(resData);
}

async function setPaymentProcessing(req, res) {
    if (req.user.id == 1) {
        const { hourlyLimit, dailyLimit, maximumWithdrawAmount, minimumWithdrawAmount } = req.body;
        await db.Admin.update({
            withdraw_hourly_limit: hourlyLimit,
            withdraw_daily_limit: dailyLimit,
            minimum_withdraw_amount: minimumWithdrawAmount,
            maximum_withdraw_amount: maximumWithdrawAmount
        }, {
            where: {
                id: 1
            }
        })
        const resData = {
            message: 'Successfully saved!'
        }
        return res.status(200).send(resData);
    }
    return res.status(500).send({ message: 'Authentication failed' });
}