const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TimeSlot extends Model {}

TimeSlot.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  dayOfWeek: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects',
      key: 'id'
    }
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
  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  effectiveDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'End date for temporary schedule changes'
  },
  recurrence: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Recurrence pattern for the time slot'
  },
  attendanceStats: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Aggregated attendance statistics for this slot'
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'rescheduled', 'holiday'),
    defaultValue: 'active'
  },
  cancelReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the time slot'
  },
  searchVector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'TimeSlot',
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
      fields: ['subjectId', 'sectionId', 'dayOfWeek']
    },
    {
      fields: ['facultyId', 'status']
    },
    {
      fields: ['effectiveDate', 'endDate']
    }
  ],
  validate: {
    timeOrder() {
      if (this.startTime >= this.endTime) {
        throw new Error('End time must be after start time');
      }
    },
    dateOrder() {
      if (this.endDate && this.effectiveDate > this.endDate) {
        throw new Error('End date must be after effective date');
      }
    }
  },
  hooks: {
    beforeCreate: async (timeSlot) => {
      // Check for faculty time slot overlaps
      const overlappingSlot = await TimeSlot.findOne({
        where: {
          facultyId: timeSlot.facultyId,
          dayOfWeek: timeSlot.dayOfWeek,
          status: 'active',
          id: { [sequelize.Op.ne]: timeSlot.id },
          [sequelize.Op.or]: [
            {
              // New slot starts during an existing slot
              startTime: {
                [sequelize.Op.lt]: timeSlot.endTime,
                [sequelize.Op.gte]: timeSlot.startTime
              }
            },
            {
              // New slot ends during an existing slot
              endTime: {
                [sequelize.Op.gt]: timeSlot.startTime,
                [sequelize.Op.lte]: timeSlot.endTime
              }
            },
            {
              // New slot completely contains an existing slot
              [sequelize.Op.and]: [
                { startTime: { [sequelize.Op.gte]: timeSlot.startTime } },
                { endTime: { [sequelize.Op.lte]: timeSlot.endTime } }
              ]
            }
          ]
        }
      });

      if (overlappingSlot) {
        throw new Error('Faculty already has a class scheduled during this time slot');
      }
    },
    beforeUpdate: async (timeSlot) => {
      // Only check for overlaps if time-related fields are changed
      if (timeSlot.changed('startTime') || timeSlot.changed('endTime') || 
          timeSlot.changed('dayOfWeek') || timeSlot.changed('facultyId')) {
        // Check for faculty time slot overlaps
        const overlappingSlot = await TimeSlot.findOne({
          where: {
            facultyId: timeSlot.facultyId,
            dayOfWeek: timeSlot.dayOfWeek,
            status: 'active',
            id: { [sequelize.Op.ne]: timeSlot.id },
            [sequelize.Op.or]: [
              {
                // New slot starts during an existing slot
                startTime: {
                  [sequelize.Op.lt]: timeSlot.endTime,
                  [sequelize.Op.gte]: timeSlot.startTime
                }
              },
              {
                // New slot ends during an existing slot
                endTime: {
                  [sequelize.Op.gt]: timeSlot.startTime,
                  [sequelize.Op.lte]: timeSlot.endTime
                }
              },
              {
                // New slot completely contains an existing slot
                [sequelize.Op.and]: [
                  { startTime: { [sequelize.Op.gte]: timeSlot.startTime } },
                  { endTime: { [sequelize.Op.lte]: timeSlot.endTime } }
                ]
              }
            ]
          }
        });

        if (overlappingSlot) {
          throw new Error('Faculty already has a class scheduled during this time slot');
        }
      }
    }
  }
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION time_slot_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.room_number, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.day_of_week, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.cancel_reason, '')), 'C');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS time_slot_search_vector_trigger ON "TimeSlots";
  
  CREATE TRIGGER time_slot_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "TimeSlots"
  FOR EACH ROW
  EXECUTE FUNCTION time_slot_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = TimeSlot;