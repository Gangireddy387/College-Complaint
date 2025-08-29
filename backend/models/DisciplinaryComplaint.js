const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class DisciplinaryComplaint extends Model {}

DisciplinaryComplaint.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timeSlotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TimeSlots',
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
  complaintType: {
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
  reportedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Faculty',
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
  actionTaken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parentNotified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  parentNotificationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  disciplinaryAction: {
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
  principalRemarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  principalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Principal',
      key: 'id'
    }
  },
  escalatedToPrincipalAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Faculty',
      key: 'id'
    }
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  previousIncidents: {
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
  searchVector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'DisciplinaryComplaint',
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
      fields: ['studentId', 'date']
    },
    {
      fields: ['status', 'severity']
    }
  ],
  hooks: {
    beforeCreate: async (complaint) => {
      if (complaint.severity === 'critical') {
        complaint.status = 'escalated_to_principal';
        complaint.escalatedToPrincipalAt = new Date();
      }
    },
    beforeUpdate: async (complaint) => {
      if (complaint.changed('status') && complaint.status === 'escalated_to_principal') {
        complaint.escalatedToPrincipalAt = new Date();
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

  DROP TRIGGER IF EXISTS disciplinary_complaint_search_vector_trigger ON "DisciplinaryComplaints";
  
  CREATE TRIGGER disciplinary_complaint_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "DisciplinaryComplaints"
  FOR EACH ROW
  EXECUTE FUNCTION disciplinary_complaint_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = DisciplinaryComplaint;