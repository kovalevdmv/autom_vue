import Sequelize from 'sequelize';

// Настройка соединения с базой данных
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './mydb.sqlite' // путь к файлу базы данных
});

export {sequelize};
