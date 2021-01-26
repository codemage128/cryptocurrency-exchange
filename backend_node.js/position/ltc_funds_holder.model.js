const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: {
            type: DataTypes.INTEGER
        },
        funds: {
            type: DataTypes.FLOAT
        },
        coin_amount: {
            type: DataTypes.FLOAT
        },
        position_id: {
            type: DataTypes.INTEGER
        }
    };
    return sequelize.define('LtcFundsHolder', attributes);
}