const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        referrer_id: {
            type: DataTypes.STRING
        },
        btc_amount: {
            type: DataTypes.FLOAT
        },
        ltc_amount: {
            type: DataTypes.FLOAT
        },
        doge_amount: {
            type: DataTypes.FLOAT
        },
        referrer_users_id: {
            type: DataTypes.STRING
        },
        referrer_byuser: {
            type: DataTypes.STRING
        }
    };
    return sequelize.define('MemberPayment', attributes);
}