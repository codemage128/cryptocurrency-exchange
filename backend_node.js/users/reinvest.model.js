const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        admin_fee: {
            type: DataTypes.FLOAT
        },
        member_amount: {
            type: DataTypes.FLOAT
        },
        referral_commission: {
            type: DataTypes.STRING
        },
    };
    return sequelize.define('Reinvest', attributes);
}