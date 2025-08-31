const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class ClassRoom extends Model {
  // Instance methods
  async isAvailable(date, startTime, endTime) {
    const bookings = await sequelize.models.TimeSlot.findAll({
      where: {
        room_number: this.room_number,
        date,
        status: 'active',
        $or: [
          {
            startTime: { $between: [startTime, endTime] }
          },
          {
            endTime: { $between: [startTime, endTime] }
          }
        ]
      }
    });
    return bookings.length === 0;
  }

  async getCurrentCapacityUtilization() {
    const currentOccupancy = this.current_occupancy || 0;
    return {
      capacity: this.capacity,
      currentOccupancy,
      utilizationPercentage: (currentOccupancy / this.capacity) * 100
    };
  }

  async addMaintenance(details) {
    const maintenanceHistory = this.maintenance_history || [];
    maintenanceHistory.push({
      date: new Date(),
      ...details
    });
    await this.update({
      maintenance_history: maintenanceHistory,
      last_maintenance: new Date(),
      next_maintenance: details.nextMaintenanceDate
    });
  }
}

ClassRoom.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isValidFormat(value) {
        if (!/^[A-Z0-9]{1,3}-\d{3}$/.test(value)) {
          throw new Error('Room number must be in format: BLOCK-NUMBER (e.g., A-101, CS-203)');
        }
      }
    }
  },
  building: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 20 // Assuming maximum 20 floors
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 500, // Reasonable maximum capacity
      isValidForType(value) {
        const maxCapacities = {
          'lecture_hall': 300,
          'classroom': 60,
          'lab': 40,
          'seminar_hall': 100
        };
        if (value > maxCapacities[this.type]) {
          throw new Error(`Maximum capacity for ${this.type} is ${maxCapacities[this.type]}`);
        }
      }
    }
  },
  type: {
    type: DataTypes.ENUM('lecture_hall', 'classroom', 'lab', 'seminar_hall'),
    allowNull: false,
    defaultValue: 'classroom'
  },
  facilities: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Available facilities like projector, AC, computers, etc.',
    validate: {
      isValidFacilities(value) {
        const requiredFacilities = {
          'lecture_hall': ['projector', 'audio_system'],
          'lab': ['computers', 'network'],
          'classroom': ['whiteboard'],
          'seminar_hall': ['projector', 'audio_system', 'whiteboard']
        };
        const required = requiredFacilities[this.type];
        const missing = required.filter(f => !value[f]);
        if (missing.length > 0) {
          throw new Error(`Missing required facilities for ${this.type}: ${missing.join(', ')}`);
        }
      }
    }
  },
  dimensions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Room dimensions and layout information',
    validate: {
      hasRequiredDimensions(value) {
        if (!value.length || !value.width || !value.height) {
          throw new Error('Dimensions must include length, width, and height');
        }
      }
    }
  },
  schedule: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Room booking schedule'
  },
  maintenance_history: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'History of maintenance activities'
  },
  equipment: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'List of equipment available in the room'
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'renovation', 'inactive'),
    defaultValue: 'active',
    validate: {
      statusTransition(value) {
        if (this.status === 'inactive' && value !== 'maintenance') {
          throw new Error('Inactive rooms must go through maintenance before activation');
        }
      }
    }
  },
  last_maintenance: {
    type: DataTypes.DATE,
    allowNull: true
  },
  next_maintenance: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isAfterLastMaintenance(value) {
        if (value && this.last_maintenance && value <= this.last_maintenance) {
          throw new Error('Next maintenance must be after last maintenance');
        }
      }
    }
  },
  current_occupancy: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      notOverCapacity(value) {
        if (value > this.capacity) {
          throw new Error('Current occupancy cannot exceed room capacity');
        }
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000] // Maximum 1000 characters for notes
    }
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional metadata about the classroom'
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
  modelName: 'ClassRoom',
  timestamps: true,
  indexes: [
    {
      fields: ['search_vector'],
      using: 'gin',
      name: 'classroom_search_idx'
    },
    {
      fields: ['metadata'],
      using: 'gin',
      name: 'classroom_metadata_idx'
    },
    {
      fields: ['facilities'],
      using: 'gin',
      name: 'classroom_facilities_idx'
    },
    {
      fields: ['schedule'],
      using: 'gin',
      name: 'classroom_schedule_idx'
    },
    {
      fields: ['type', 'status'],
      name: 'classroom_type_status_idx'
    },
    {
      fields: ['building', 'floor'],
      name: 'classroom_location_idx'
    }
  ],
  hooks: {
    beforeValidate: async (classroom) => {
      // Ensure room number follows building convention
      if (classroom.room_number && classroom.building) {
        const buildingPrefix = classroom.room_number.split('-')[0];
        if (!classroom.building.includes(buildingPrefix)) {
          throw new Error('Room number must match building prefix');
        }
      }
    },
    beforeUpdate: async (classroom) => {
      // Track maintenance schedule
      if (classroom.changed('status')) {
        if (classroom.status === 'maintenance') {
          classroom.last_maintenance = new Date();
          classroom.next_maintenance = new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)); // 90 days
        }
      }
    },
    afterCreate: async (classroom) => {
      // Initialize maintenance schedule
      classroom.next_maintenance = new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)); // 90 days
      await classroom.save();
    }
  }
});

// PostgreSQL-specific: Trigger for updating search vector
sequelize.query(`
  CREATE OR REPLACE FUNCTION class_room_search_vector_update() RETURNS trigger AS $$
  BEGIN
    NEW.search_vector :=
      setweight(to_tsvector('english', COALESCE(NEW.room_number, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.building, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.type, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.notes, '')), 'C');
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS class_room_search_vector_trigger ON "class_rooms";
  
  CREATE TRIGGER class_room_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "class_rooms"
  FOR EACH ROW
  EXECUTE FUNCTION class_room_search_vector_update();
`).catch(err => console.log('Search vector trigger already exists'));

module.exports = ClassRoom;