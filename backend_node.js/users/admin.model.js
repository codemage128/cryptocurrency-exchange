const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        position_price: {
            type: DataTypes.FLOAT
        },
        to_affiliate: {
            type: DataTypes.FLOAT
        },
        to_admin: {
            type: DataTypes.FLOAT
        },
        affiliate_level_percentage: {
            type: DataTypes.STRING
        },
        splite_limites: {
            type: DataTypes.INTEGER
        },
        level_count: {
            type: DataTypes.INTEGER
        },
        withdraw_hourly_limit: {
            type: DataTypes.FLOAT
        },
        withdraw_daily_limit: {
            type: DataTypes.FLOAT
        },
        minimum_withdraw_amount: {
            type: DataTypes.FLOAT
        },
        maximum_withdraw_amount: {
            type: DataTypes.FLOAT
        }
    };
    return sequelize.define('Admin', attributes);
}