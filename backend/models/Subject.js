const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Subject extends Model {}

Subject.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subjectCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sections',
      key: 'id'
    }
  },
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Faculty',
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
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  type: {
    type: DataTypes.ENUM('theory', 'practical', 'tutorial'),
    allowNull: false
  },
  syllabus: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  objectives: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
    comment: 'Learning objectives of the subject'
  },
  prerequisites: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'Prerequisite subject codes'
  },
  resources: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Study materials and resources'
  },
  assessmentPattern: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Weightage of different assessments'
  },
  schedule: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Weekly schedule and topic distribution'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the subject'
  },
  searchVector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Subject',
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
      fields: ['prerequisites'],
      using: 'gin'
    },
    {
      fields: ['sectionId', 'semester']
    },
    {
      fields: ['facultyId', 'status']
    }
  ]
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION subject_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.subject_name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.subject_code, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.syllabus, '')), 'B') ||
      setweight(to_tsvector('english', array_to_string(NEW.objectives, ' ')), 'C');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS subject_search_vector_trigger ON "Subjects";
  
  CREATE TRIGGER subject_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Subjects"
  FOR EACH ROW
  EXECUTE FUNCTION subject_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = Subject;