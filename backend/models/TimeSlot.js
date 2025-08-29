const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class TimeSlot extends Model {}

TimeSlot.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  day_of_week: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: false
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'subjects',
      key: 'id'
    }
  },
  section_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sections',
      key: 'id'
    }
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'faculties',
      key: 'id'
    }
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  effective_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'End date for temporary schedule changes'
  },
  recurrence: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Recurrence pattern for the time slot'
  },
  attendance_stats: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Aggregated attendance statistics for this slot'
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'rescheduled', 'holiday'),
    defaultValue: 'active'
  },
  cancel_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the time slot'
  },
  search_vector: {
    type: DataTypes.TSVECTOR,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'TimeSlot',
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
      fields: ['subject_id', 'section_id', 'day_of_week']
    },
    {
      fields: ['faculty_id', 'status']
    },
    {
      fields: ['effective_date', 'end_date']
    }
  ],
  validate: {
    timeOrder() {
      if (this.start_time >= this.end_time) {
        throw new Error('End time must be after start time');
      }
    },
    dateOrder() {
      if (this.end_date && this.effective_date > this.end_date) {
        throw new Error('End date must be after effective date');
      }
    }
  },
  hooks: {
    beforeCreate: async (timeSlot) => {
      // Check for faculty time slot overlaps
      const overlappingSlot = await TimeSlot.findOne({
        where: {
          faculty_id: timeSlot.faculty_id,
          day_of_week: timeSlot.day_of_week,
          status: 'active',
          id: { [sequelize.Op.ne]: timeSlot.id },
          [sequelize.Op.or]: [
            {
              // New slot starts during an existing slot
              start_time: {
                [sequelize.Op.lt]: timeSlot.end_time,
                [sequelize.Op.gte]: timeSlot.start_time
              }
            },
            {
              // New slot ends during an existing slot
              end_time: {
                [sequelize.Op.gt]: timeSlot.start_time,
                [sequelize.Op.lte]: timeSlot.end_time
              }
            },
            {
              // New slot completely contains an existing slot
              [sequelize.Op.and]: [
                { start_time: { [sequelize.Op.gte]: timeSlot.start_time } },
                { end_time: { [sequelize.Op.lte]: timeSlot.end_time } }
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
      if (timeSlot.changed('start_time') || timeSlot.changed('end_time') || 
          timeSlot.changed('day_of_week') || timeSlot.changed('faculty_id')) {
        // Check for faculty time slot overlaps
        const overlappingSlot = await TimeSlot.findOne({
          where: {
            faculty_id: timeSlot.faculty_id,
            day_of_week: timeSlot.day_of_week,
            status: 'active',
            id: { [sequelize.Op.ne]: timeSlot.id },
            [sequelize.Op.or]: [
              {
                // New slot starts during an existing slot
                start_time: {
                  [sequelize.Op.lt]: timeSlot.end_time,
                  [sequelize.Op.gte]: timeSlot.start_time
                }
              },
              {
                // New slot ends during an existing slot
                end_time: {
                  [sequelize.Op.gt]: timeSlot.start_time,
                  [sequelize.Op.lte]: timeSlot.end_time
                }
              },
              {
                // New slot completely contains an existing slot
                [sequelize.Op.and]: [
                  { start_time: { [sequelize.Op.gte]: timeSlot.start_time } },
                  { end_time: { [sequelize.Op.lte]: timeSlot.end_time } }
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

  DROP TRIGGER IF EXISTS time_slot_search_vector_trigger ON "time_slots";
  
  CREATE TRIGGER time_slot_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "time_slots"
  FOR EACH ROW
  EXECUTE FUNCTION time_slot_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = TimeSlot;