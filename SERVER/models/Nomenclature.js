import Sequelize from 'sequelize';
import {sequelize} from '../sequelize-config.js';

const Nomenclature = sequelize.define('Nomenclature', {
  // Атрибуты модели
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
    // другие настройки атрибута
  },
  price: {
    type: Sequelize.DECIMAL
  }
  // Другие атрибуты...
});

export { Nomenclature };
