const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/**
 * donation Schema
 * @private
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your Name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'organization', 'helper', 'admin', 'visitor'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'PLease provide a password'],
    minlength: 8,
    select: false
  },
  passwordChangedAt: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //this only works on CREATE or save !!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

/**
 * Password hash middleware.
 */

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash  the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete the password confirm fill
  this.passwordConfirm = undefined;
  next();
});

/**
 * Password Changed time .
 */

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * Helper method for validating user's password.
 */

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  //False means not changed
  return false;
};

/**
 * Password reset Token.
 */

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
