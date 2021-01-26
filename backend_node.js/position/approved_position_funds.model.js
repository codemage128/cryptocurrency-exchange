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
        coin_type: {
            type: DataTypes.STRING
        }
    };
    return sequelize.define('ApprovedPositionFunds', attributes);
}