const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { OTP, Principal } = require('../models');

// Send OTP for password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if principal exists with this email
    const principal = await Principal.findOne({ where: { email } });
    if (!principal) {
      return res.status(404).json({ message: 'No principal found with this email address' });
    }

    // Invalidate any existing OTPs for this email
    await OTP.invalidateExistingOTPs(email, 'password_reset');

    // Generate and save new OTP
    const otpRecord = await OTP.createWithExpiration(email, 'password_reset');

    // TODO: In a real application, you would send the OTP via email
    // For now, we'll just log it to console for testing
    console.log(`OTP for ${email}: ${otpRecord.otp}`);

    res.status(200).json({
      message: 'OTP sent successfully',
      // In production, remove this line and implement actual email sending
      otp: otpRecord.otp
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Check if principal exists
    const principal = await Principal.findOne({ where: { email } });
    if (!principal) {
      return res.status(404).json({ message: 'No principal found with this email address' });
    }

    // Find and validate OTP
    const otpRecord = await OTP.findValidOTP(email, otp, 'password_reset');
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await otpRecord.update({ isUsed: true });

    res.status(200).json({
      message: 'OTP verified successfully',
      email: email
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if principal exists
    const principal = await Principal.findOne({ where: { email } });
    if (!principal) {
      return res.status(404).json({ message: 'No principal found with this email address' });
    }

    // Find the OTP record (should be marked as used after verification)
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp,
        type: 'password_reset',
        isUsed: true
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP or OTP not verified. Please verify OTP first.' });
    }

    // Check if OTP is not expired
    if (otpRecord.isExpired()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Update principal's password (will be hashed by the model hook)
    console.log(`Updating password for principal: ${email}`);
    await principal.update({ password: newPassword });
    console.log(`Password updated successfully for: ${email}`);

    // Mark this OTP as completely used (optional - for cleanup)
    await otpRecord.update({ isUsed: true });

    console.log(`Password reset successfully for ${email}`);

    res.status(200).json({
      message: 'Password reset successfully',
      success: true
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

    // Clean up expired OTPs (can be called by a cron job)
    router.delete('/cleanup-expired-otps', async (req, res) => {
      try {
        const result = await OTP.destroy({
          where: {
            expiresAt: {
              [require('sequelize').Op.lt]: new Date()
            }
          }
        });

    res.status(200).json({
      message: `Cleaned up ${result} expired OTPs`
    });

  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
