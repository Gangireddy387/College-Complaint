const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
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
  student_id: {
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
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 8
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  address: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Student address details in JSON format'
  },
  guardian_info: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Parent/Guardian contact information'
  },
  academic_history: {
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
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the student'
  },
  search_vector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  },
  collegeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'colleges',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Student',
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
      fields: ['department_id', 'semester']
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
    },
    afterCreate: async (student) => {
      await updateDepartmentStudentCount(student.department_id);
    },
    afterUpdate: async (student) => {
      await updateDepartmentStudentCount(student.department_id);
    },
    afterDestroy: async (student) => {
      await updateDepartmentStudentCount(student.department_id);
    }
  }
});

// Function to update department student count
async function updateDepartmentStudentCount(departmentId) {
  try {
    const Department = require('./Department');
    
    // Count active students in this department
    const studentCount = await Student.count({
      where: { 
        department_id: departmentId,
        status: 'active'
      }
    });
    
    // Update the department with new student count
    await Department.update({
      total_students: studentCount
    }, {
      where: { id: departmentId }
    });
  } catch (error) {
    console.error('Error updating department student count:', error);
  }
}

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

  DROP TRIGGER IF EXISTS student_search_vector_trigger ON "students";
  
  CREATE TRIGGER student_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "students"
  FOR EACH ROW
  EXECUTE FUNCTION student_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = Student;