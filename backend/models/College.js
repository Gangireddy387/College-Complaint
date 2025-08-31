const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class College extends Model {}

College.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('government', 'private', 'autonomous'),
    allowNull: false,
    defaultValue: 'private'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  establishment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  facilities: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Available facilities and infrastructure'
  },
  departments: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'List of departments and programs offered'
  },
  achievements: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'College achievements and accolades'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the college'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  sequelize,
  modelName: 'College',
  timestamps: true
});

module.exports = College;
