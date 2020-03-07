const mongoose = require('mongoose');
// const slugify = require('slugify');

/**
 * stone Schema
 * @private
 */

const stoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Donation must have a name'],
      trim: true,
      maxlength: [
        40,
        'A Donation name must have less or equal then 40 characters'
      ],
      minlength: [
        5,
        'A Donation name must have more or equal then 10 characters'
      ]
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
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
    startDate: Date,
    endData: Date
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

stoneSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

stoneSchema.pre('save', function(next) {
  // eslint-disable-next-line no-console
  console.log('Saving Stone..');
  next();
});
stoneSchema.pre(/^find/, function(next) {
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
 * @typedef stoneSchema
 */

const Stone = mongoose.model('Stone', stoneSchema);
module.exports = Stone;
