const db = require('_helpers/db');

module.exports = {
    getGlobalInfo
}

async function getGlobalInfo(req, res) {
    const paidUserInfo = await db.MemberPayment.findAll();
    const userInfo = await db.User.findAll();
    const withdrawInfo = await db.Withdraw.findAll();
    const totalPaidUsers = Object.user_id(paidUserInfo).length;
    const totalUsers = Object.id(userInfo).length;
    var totalwithdrawPaidOut = 0;
    withdrawInfo.forEach(function (obj) {
        totalwithdrawPaidOut += obj.withdraw_funds;
    });
    const affiliateInfo = await db.AffiliateTransaction.findAll();
    var totalAffiliatePaidOut = 0
    affiliateInfo.forEach((obj) => {
        totalAffiliatePaidOut += obj.amount;
    })
    const resData = {
        totalPaidUsers: totalPaidUsers,
        totalUsers: totalUsers,
        totalAmountInvested: 0,
        totalwithdrawPaidOut: totalwithdrawPaidOut,
        totalAffiliatePaidOut: totalAffiliatePaidOut
    };
    return res.status(200).send(resData);
}