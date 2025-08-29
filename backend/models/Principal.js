const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

class Principal extends Model {
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

Principal.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  sequelize,
  modelName: 'Principal',
  timestamps: true,
  hooks: {
    beforeCreate: async (principal) => {
      if (principal.password) {
        const salt = await bcrypt.genSalt(10);
        principal.password = await bcrypt.hash(principal.password, salt);
      }
    },
    beforeUpdate: async (principal) => {
      if (principal.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        principal.password = await bcrypt.hash(principal.password, salt);
      }
    }
  }
});

module.exports = Principal;
