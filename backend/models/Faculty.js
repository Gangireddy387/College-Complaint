const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

class Faculty extends Model {
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

Faculty.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
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
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specializations: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Array of faculty specializations'
  },
  qualifications: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Academic and professional qualifications'
  },
  phone_number: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  joining_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  experience: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Previous work experience'
  },
  publications: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Research publications and papers'
  },
  achievements: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Awards and recognitions'
  },
  current_workload: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Current teaching hours per week'
  },
  status: {
    type: DataTypes.ENUM('active', 'on_leave', 'inactive', 'terminated'),
    defaultValue: 'active'
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the faculty'
  },
  search_vector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Faculty',
  timestamps: true,
  indexes: [
    {
      fields: ['search_vector'],
      using: 'gin'
    },
    {
      fields: ['metadata'],
      using: 'gin'
    },
    {
      fields: ['department_id', 'status']
    },
    {
      fields: ['specializations'],
      using: 'gin'
    }
  ],
  hooks: {
    beforeCreate: async (faculty) => {
      if (faculty.password) {
        const salt = await bcrypt.genSalt(10);
        faculty.password = await bcrypt.hash(faculty.password, salt);
      }
    },
    beforeUpdate: async (faculty) => {
      if (faculty.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        faculty.password = await bcrypt.hash(faculty.password, salt);
      }
    }
  }
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION faculty_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.first_name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.last_name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.employee_id, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.designation, '')), 'B');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS faculty_search_vector_trigger ON "faculties";
  
  CREATE TRIGGER faculty_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "faculties"
  FOR EACH ROW
  EXECUTE FUNCTION faculty_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = Faculty;