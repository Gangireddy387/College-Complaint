const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  otp: {
    type: DataTypes.STRING(4),
    allowNull: false,
    validate: {
      len: [4, 4],
      isNumeric: true,
    },
  },
  type: {
    type: DataTypes.ENUM('password_reset', 'email_verification'),
    allowNull: false,
    defaultValue: 'password_reset',
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  collegeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'colleges',
      key: 'id'
    }
  },
}, {
  tableName: 'otps',
  timestamps: true,
  underscored: true,
});

// Instance method to check if OTP is expired
OTP.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Instance method to check if OTP is valid (not used and not expired)
OTP.prototype.isValid = function() {
  return !this.isUsed && !this.isExpired();
};

// Static method to generate a random 4-digit OTP
OTP.generateOTP = function() {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Static method to create OTP with expiration (15 minutes from now)
OTP.createWithExpiration = function(email, type = 'password_reset') {
  const otp = OTP.generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  return OTP.create({
    email,
    otp,
    type,
    expiresAt,
  });
};

// Static method to invalidate all existing OTPs for an email
OTP.invalidateExistingOTPs = async function(email, type = 'password_reset') {
  return await OTP.update(
    { isUsed: true },
    {
      where: {
        email,
        type,
        isUsed: false,
      },
    }
  );
};

// Static method to find valid OTP
OTP.findValidOTP = async function(email, otp, type = 'password_reset') {
  const otpRecord = await OTP.findOne({
    where: {
      email,
      otp,
      type,
      isUsed: false,
    },
  });

  if (!otpRecord) {
    return null;
  }

  if (otpRecord.isExpired()) {
    return null;
  }

  return otpRecord;
};

module.exports = OTP;
