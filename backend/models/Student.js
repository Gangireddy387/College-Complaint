const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

class Student extends Model {
  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
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
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Departments',
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
  phoneNumber: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  address: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Student address details in JSON format'
  },
  guardianInfo: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Parent/Guardian contact information'
  },
  academicHistory: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Previous academic records'
  },
  achievements: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Student achievements and certifications'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'alumni', 'suspended'),
    defaultValue: 'active'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the student'
  },
  searchVector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Student',
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
      fields: ['departmentId', 'semester']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeCreate: async (student) => {
      if (student.password) {
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt);
      }
    },
    beforeUpdate: async (student) => {
      if (student.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt);
      }
    }
  }
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION student_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.first_name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.last_name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.student_id, '')), 'A');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS student_search_vector_trigger ON "Students";
  
  CREATE TRIGGER student_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Students"
  FOR EACH ROW
  EXECUTE FUNCTION student_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = Student;