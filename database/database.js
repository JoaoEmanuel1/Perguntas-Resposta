const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', '181029', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;