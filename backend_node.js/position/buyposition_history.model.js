const {
    DataTypes,
    UUID
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: {
            type: DataTypes.INTEGER
        },
        position_count: {
            type: DataTypes.INTEGER
        },
        coin_type: {
            type: DataTypes.STRING
        },
        change_balance: {
            type: DataTypes.STRING
        },
        coin_address: {
            type: DataTypes.STRING
        },
        confirmation_number: {
            type: DataTypes.INTEGER
        },
    };
    return sequelize.define('PositionPaymentHistory', attributes);
}