const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class SectionStudent extends Model {}

SectionStudent.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sections',
      key: 'id'
    }
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  roll_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Roll number within the section'
  },
  status: {
    type: DataTypes.ENUM('active', 'transferred', 'completed', 'dropped'),
    defaultValue: 'active'
  },
  join_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
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
      fields: ['section_id', 'student_id']
    },
    {
      unique: true,
      fields: ['section_id', 'roll_number']
    }
  ],
  hooks: {
    beforeCreate: async (sectionStudent) => {
      // Auto-generate roll number if not provided
      if (!sectionStudent.roll_number) {
        const maxRoll = await SectionStudent.max('roll_number', {
          where: { section_id: sectionStudent.section_id }
        });
        sectionStudent.roll_number = (maxRoll || 0) + 1;
      }
    }
  }
});

module.exports = SectionStudent;
