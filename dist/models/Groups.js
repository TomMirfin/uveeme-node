"use strict";
const Sequelize = require('sequelize');
const sequalize = require('../util/database');
const Group = sequalize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: Sequelize.STRING
});
