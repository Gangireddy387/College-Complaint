const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class DisciplinaryComplaint extends Model {}

DisciplinaryComplaint.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  time_slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'time_slots',
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
  complaint_type: {
    type: DataTypes.ENUM(
      'late_arrival',
      'disturbance',
      'misbehavior',
      'unauthorized_device_usage',
      'inappropriate_conduct',
      'academic_dishonesty',
      'bullying',
      'other'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  reported_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'faculties',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'under_review',
      'escalated_to_principal',
      'action_taken',
      'resolved',
      'dismissed'
    ),
    defaultValue: 'pending'
  },
  action_taken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_notified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  parent_notification_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  disciplinary_action: {
    type: DataTypes.ENUM(
      'warning',
      'counseling',
      'parent_meeting',
      'detention',
      'suspension',
      'other'
    ),
    allowNull: true
  },
  principal_remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  principal_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'principals',
      key: 'id'
    }
  },
  escalated_to_principal_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'faculties',
      key: 'id'
    }
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  previous_incidents: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Count of previous similar incidents by this student'
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of attachment URLs or references'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the complaint'
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
  modelName: 'DisciplinaryComplaint',
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
      fields: ['student_id', 'date']
    },
    {
      fields: ['status', 'severity']
    }
  ],
  hooks: {
    beforeCreate: async (complaint) => {
      if (complaint.severity === 'critical') {
        complaint.status = 'escalated_to_principal';
        complaint.escalated_to_principal_at = new Date();
      }
    },
    beforeUpdate: async (complaint) => {
      if (complaint.changed('status') && complaint.status === 'escalated_to_principal') {
        complaint.escalated_to_principal_at = new Date();
      }
    }
  }
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION disciplinary_complaint_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.action_taken, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.principal_remarks, '')), 'C');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS disciplinary_complaint_search_vector_trigger ON "disciplinary_complaints";
  
  CREATE TRIGGER disciplinary_complaint_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "disciplinary_complaints"
  FOR EACH ROW
  EXECUTE FUNCTION disciplinary_complaint_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = DisciplinaryComplaint;