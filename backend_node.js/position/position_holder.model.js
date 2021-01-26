const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: {
            type: DataTypes.INTEGER
        },
        position_id: {
            type: DataTypes.INTEGER
        },
        btc_funds: {
            type: DataTypes.FLOAT
        },
        ltc_funds: {
            type: DataTypes.FLOAT
        },
        doge_funds: {
            type: DataTypes.FLOAT
        },
    };
    return sequelize.define('PositionHolder', attributes);
} 