const {
    DataTypes
} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: {
            type: DataTypes.INTEGER
        },
        withdraw_funds: {
            type: DataTypes.FLOAT
        },
        coin_type: {
            type: DataTypes.STRING
        }
    };
    return sequelize.define('Withdraw', attributes);
}
