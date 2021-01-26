const {
    DataTypes,
    UUID
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        // unique_id: { type: DataTypes.UUID, allowNull: false },
        user_id: {
            type: DataTypes.INTEGER
        },
        position_count: {
            type: DataTypes.INTEGER
        },
        coin_type: {
            type: DataTypes.STRING
        },
        coin_amount: {
            type: DataTypes.STRING
        },
        coin_address: {
            type: DataTypes.STRING
        },
    };
    return sequelize.define('BuyPosition', attributes);
}