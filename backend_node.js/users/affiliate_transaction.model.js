const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        transaction_id: {
            type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.FLOAT
        },
        transaction_type: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        referrer_user: {
            type: DataTypes.STRING
        },
        level_value: {
            type: DataTypes.INTEGER
        },
        referrer_userid: {
            type: DataTypes.INTEGER
        }
    };
    return sequelize.define('AffiliateTransaction', attributes);
}