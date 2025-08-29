const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SectionStudent extends Model {}

SectionStudent.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sections',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  rollNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Roll number within the section'
  },
  status: {
    type: DataTypes.ENUM('active', 'transferred', 'completed', 'dropped'),
    defaultValue: 'active'
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'SectionStudent',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['sectionId', 'studentId']
    },
    {
      unique: true,
      fields: ['sectionId', 'rollNumber']
    }
  ],
  hooks: {
    beforeCreate: async (sectionStudent) => {
      // Auto-generate roll number if not provided
      if (!sectionStudent.rollNumber) {
        const maxRoll = await SectionStudent.max('rollNumber', {
          where: { sectionId: sectionStudent.sectionId }
        });
        sectionStudent.rollNumber = (maxRoll || 0) + 1;
      }
    }
  }
});

module.exports = SectionStudent;
