const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Attendance extends Model {
  // Instance methods
  static async getAttendanceStats(timeSlotId, startDate, endDate) {
    const stats = await this.findAll({
      where: {
        timeSlotId,
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

  static async getStudentAttendance(studentId, subjectId, semester) {
    const stats = await this.findAll({
      where: { studentId },
      include: [{
        model: TimeSlot,
        where: { subjectId },
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
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    allowNull: false,
    validate: {
      isIn: [['present', 'absent', 'late', 'excused']]
    }
  },
  lateMinutes: {
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
  markedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Faculty',
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
  markedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  lastModifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Faculty',
      key: 'id'
    }
  },
  modificationHistory: {
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
  proofOfAbsence: {
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
      fields: ['timeSlotId', 'studentId', 'date'],
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
      fields: ['modificationHistory'],
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
      fields: ['markedBy', 'date'],
      name: 'attendance_faculty_date_idx'
    }
  ],
  hooks: {
    beforeValidate: async (attendance) => {
      // Validate date is within time slot schedule
      const timeSlot = await sequelize.models.TimeSlot.findByPk(attendance.timeSlotId);
      if (timeSlot && attendance.date < timeSlot.effectiveDate) {
        throw new Error('Attendance date must be after time slot effective date');
      }
    },
    beforeCreate: async (attendance) => {
      // Check if student is enrolled in the section
      const timeSlot = await sequelize.models.TimeSlot.findByPk(attendance.timeSlotId, {
        include: ['section']
      });
      const enrollment = await sequelize.models.SectionStudent.findOne({
        where: {
          studentId: attendance.studentId,
          sectionId: timeSlot.section.id,
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
          modifiedBy: attendance.lastModifiedBy,
          oldStatus: attendance.previous('status'),
          newStatus: attendance.status,
          oldRemarks: attendance.previous('remarks'),
          newRemarks: attendance.remarks,
          oldLateMinutes: attendance.previous('lateMinutes'),
          newLateMinutes: attendance.lateMinutes
        });
        attendance.modificationHistory = oldHistory;
      }
    },
    afterCreate: async (attendance) => {
      // Update attendance statistics in TimeSlot
      const timeSlot = await sequelize.models.TimeSlot.findByPk(attendance.timeSlotId);
      const stats = timeSlot.attendanceStats || {};
      stats[attendance.status] = (stats[attendance.status] || 0) + 1;
      await timeSlot.update({ attendanceStats: stats });
    }
  }
});

module.exports = Attendance;