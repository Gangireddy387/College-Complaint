const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Section extends Model {}

Section.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Departments',
      key: 'id'
    }
  },
  classRoomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ClassRooms',
      key: 'id'
    }
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 8
    }
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
    validate: {
      min: 1
    }
  },
  classTeacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Faculty',
      key: 'id'
    }
  },
  shift: {
    type: DataTypes.ENUM('morning', 'afternoon', 'evening'),
    allowNull: false,
    defaultValue: 'morning'
  },
  schedule: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Weekly class schedule'
  },
  events: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Section-specific events and activities'
  },
  announcements: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Section announcements'
  },
  currentStrength: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  attendanceStats: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Aggregated attendance statistics'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the section'
  },
  searchVector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Section',
  timestamps: true,
  indexes: [
    {
      fields: ['searchVector'],
      using: 'gin'
    },
    {
      fields: ['metadata'],
      using: 'gin'
    },
    {
      fields: ['departmentId', 'semester', 'academicYear']
    },
    {
      fields: ['classTeacherId', 'status']
    }
  ],
  hooks: {
    beforeCreate: async (section) => {
      const ClassRoom = require('./ClassRoom');
      const classroom = await ClassRoom.findByPk(section.classRoomId);
      if (classroom && section.capacity > classroom.capacity) {
        throw new Error('Section capacity cannot exceed classroom capacity');
      }
    }
  }
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION section_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.academic_year, '')), 'B');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS section_search_vector_trigger ON "Sections";
  
  CREATE TRIGGER section_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Sections"
  FOR EACH ROW
  EXECUTE FUNCTION section_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = Section;