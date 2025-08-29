const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Department extends Model {}

Department.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hodId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Faculty',
      key: 'id'
    }
  },
  establishedYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: new Date().getFullYear()
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Department location details including building, floor, etc.'
  },
  facilities: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'List of facilities available in the department'
  },
  programs: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Academic programs offered by the department'
  },
  achievements: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Department achievements and accolades'
  },
  researchAreas: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Research focus areas of the department'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalFaculty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  budget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Current fiscal year budget'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the department'
  },
  searchVector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Department',
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
      fields: ['researchAreas'],
      using: 'gin'
    },
    {
      fields: ['status']
    }
  ]
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION department_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.department_code, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', array_to_string(NEW.research_areas, ' ')), 'C');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS department_search_vector_trigger ON "Departments";
  
  CREATE TRIGGER department_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Departments"
  FOR EACH ROW
  EXECUTE FUNCTION department_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = Department;