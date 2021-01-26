const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: {
            type: DataTypes.INTEGER
        },
        position_counts: {
            type: DataTypes.INTEGER
        },
        total_funds: {
            type: DataTypes.FLOAT
        },
        total_coin: {
            type: DataTypes.FLOAT
        }
    };
    return sequelize.define('Funds', attributes);
}