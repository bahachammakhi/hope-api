const mongoose = require('mongoose');

/**
 * contact Schema
 * @private
 */

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name !'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Please provide your email!']
  },
  message: {
    type: String,
    trim: true,
    minlength: [10, 'Message needs to contain at least 10 caracters']
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

contactSchema.pre('save', function(next) {
  // eslint-disable-next-line no-console
  console.log('Saving Donation..');
  next();
});

/**
 * @typedef contactSchema
 */

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
