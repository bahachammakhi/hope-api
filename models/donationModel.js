const mongoose = require('mongoose');
// const slugify = require('slugify');

/**
 * donation Schema
 * @private
 */

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Donation must have a name'],
      trim: true,
      minlength: [
        5,
        'A Donation name must have more or equal then 10 characters'
      ]
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'a Donation must have an author !']
    },
    slug: String,
    contact: {
      type: String,
      trim: true,
      required: [true, 'A Donation must have a Contact']
    },
    description: {
      type: String,
      trim: true,
      minlength: [
        10,
        'A Donation Description must have more or equa"l then 10 characters'
      ]
    },
    imageCover: {
      type: String,
      required: [false, 'A Donation must have a cover image']
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

//DOCUMENT MIDDLEWARE : RUNS BEFORE .save() and .create()

// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

donationSchema.pre('save', function(next) {
  // eslint-disable-next-line no-console
  console.log('Saving Donation..');
  next();
});
donationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author'
  });
  next();
});

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWEARE

// tourSchema.pre('find', function(next) {
// donationSchema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });
// donationSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   // console.log(docs);
//   next();
// });
/**
 * @typedef donationSchema
 */

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
