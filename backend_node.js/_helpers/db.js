const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};
initialize();
async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Admin = require('../users/admin.model')(sequelize);
    db.Position = require('../users/position.model')(sequelize);
    db.BuyPosition = require('../position/buyposition.model')(sequelize);
    db.PositionPaymentHistory = require('../position/buyposition_history.model')(sequelize);
    db.Funds = require('../users/funds.model')(sequelize);
    db.ApprovedPositionFunds = require('../position/approved_position_funds.model')(sequelize);
    db.BtcFundsHolder = require('../position/btc_funds_holder.model')(sequelize);
    db.LtcFundsHolder = require('../position/ltc_funds_holder.model')(sequelize);
    db.DogeFundsHolder = require('../position/doge_funds_holder.model')(sequelize);
    db.PositionHolder = require('../position/position_holder.model')(sequelize);
    db.usersFunds = require('../position/users_funds.model')(sequelize);
    db.PendingWithdraw = require('../coins/pending_withdraw.model')(sequelize);

    db.AdminTransaction = require('../users/admin_transaction.model')(sequelize);
    db.AffiliateTransaction = require('../users/affiliate_transaction.model')(sequelize);
    db.MemberPayment = require('../users/member_payment.model')(sequelize);
    db.Withdraw = require('../coins/withdraw.model')(sequelize);
    db.Reinvest = require('../users/reinvest.model')(sequelize);

    // sync all models with database 
    await db.Admin.create({
        position_price: 1,
        to_affiliate: 5,
        to_admin: 20,
        splite_limites: 10,
        level_count: 3,
        affiliate_level_percentage: '10:5:3',
    });
    await sequelize.sync();
}