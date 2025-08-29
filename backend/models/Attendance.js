const { Model, DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

class Attendance extends Model {
  // Instance methods
  static async getAttendanceStats(time_slot_id, startDate, endDate) {
    const stats = await this.findAll({
      where: {
        time_slot_id,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });
    return stats;
  }

  static async getStudentAttendance(student_id, subject_id, semester) {
    const stats = await this.findAll({
      where: { student_id },
      include: [{
        model: TimeSlot,
        where: { subject_id },
        include: [{
          model: Subject,
          where: { semester }
        }]
      }]
    });
    return stats;
  }
}

Attendance.init({
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
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    allowNull: false,
    validate: {
      isIn: [['present', 'absent', 'late', 'excused']]
    }
  },
  late_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 180, // Maximum 3 hours late
      customValidator(value) {
        if (this.status === 'late' && !value) {
          throw new Error('Late minutes must be provided when status is late');
        }
        if (this.status !== 'late' && value) {
          throw new Error('Late minutes should only be set when status is late');
        }
      }
    }
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500] // Maximum 500 characters for remarks
    }
  },
  marked_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'faculties',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      notFuture(value) {
        if (value > new Date()) {
          throw new Error('Cannot mark attendance for future dates');
        }
      }
    }
  },
  marked_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  last_modified_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'faculties',
      key: 'id'
    }
  },
  modification_history: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'History of attendance modifications',
    validate: {
      isValidHistory(value) {
        if (!Array.isArray(value)) {
          throw new Error('Modification history must be an array');
        }
      }
    }
  },
  proof_of_absence: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Documents supporting absence (medical certificates, etc.)',
    validate: {
      isValidProof(value) {
        if (this.status === 'excused' && Object.keys(value).length === 0) {
          throw new Error('Proof of absence required for excused status');
        }
      }
    }
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the attendance'
  }
}, {
  sequelize,
  modelName: 'Attendance',
  timestamps: true,
  indexes: [
    // Unique constraint for one attendance record per student per time slot per date
    {
      unique: true,
      fields: ['time_slot_id', 'student_id', 'date'],
      name: 'unique_attendance_record'
    },
    // Index for searching metadata
    {
      fields: ['metadata'],
      using: 'gin',
      name: 'attendance_metadata_idx'
    },
    // Index for searching modification history
    {
      fields: ['modification_history'],
      using: 'gin',
      name: 'attendance_history_idx'
    },
    // Index for status queries
    {
      fields: ['status', 'date'],
      name: 'attendance_status_date_idx'
    },
    // Index for faculty queries
    {
      fields: ['marked_by', 'date'],
      name: 'attendance_faculty_date_idx'
    }
  ],
  hooks: {
    beforeValidate: async (attendance) => {
      // Validate date is within time slot schedule
      const timeSlot = await sequelize.models.TimeSlot.findByPk(attendance.time_slot_id);
      if (timeSlot && attendance.date < timeSlot.effective_date) {
        throw new Error('Attendance date must be after time slot effective date');
      }
    },
    beforeCreate: async (attendance) => {
      // Check if student is enrolled in the section
      const timeSlot = await sequelize.models.TimeSlot.findByPk(attendance.time_slot_id, {
        include: ['section']
      });
      const enrollment = await sequelize.models.SectionStudent.findOne({
        where: {
          student_id: attendance.student_id,
          section_id: timeSlot.section.id,
          status: 'active'
        }
      });
      if (!enrollment) {
        throw new Error('Student is not enrolled in this section');
      }
    },
    beforeUpdate: async (attendance) => {
      if (attendance.changed()) {
        const oldHistory = attendance.modificationHistory || [];
        oldHistory.push({
          timestamp: new Date(),
          modified_by: attendance.last_modified_by,
          old_status: attendance.previous('status'),
          new_status: attendance.status,
          old_remarks: attendance.previous('remarks'),
          new_remarks: attendance.remarks,
          old_late_minutes: attendance.previous('late_minutes'),
          new_late_minutes: attendance.late_minutes
        });
        attendance.modification_history = oldHistory;
      }
    },
    afterCreate: async (attendance) => {
      // Update attendance statistics in TimeSlot
      const timeSlot = await sequelize.models.TimeSlot.findByPk(attendance.time_slot_id);
      const stats = timeSlot.attendance_stats || {};
      stats[attendance.status] = (stats[attendance.status] || 0) + 1;
      await timeSlot.update({ attendance_stats: stats });
    }
  }
});

module.exports = Attendance;