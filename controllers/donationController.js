const Donation = require('./../models/donationModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

/**
 * Protect donation to be
 * deleted or updated only from its Author!
 * @private
 */

exports.authorProtected = catchAsync(async (req, res, next) => {
  const passed = await Donation.findById(req.params.id);
  if (!passed) {
    return next(new AppError('No donation found with that id', 404));
  }
  // eslint-disable-next-line eqeqeq
  if (passed.author._id != req.body.author) {
    return next(new AppError('You are not the author of this post !', 401));
  }
  next();
});
/**
 * GET /donation
 * @public
 */

exports.getAllDonations = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Donation.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const donations = await features.query;

  res.status(200).json({
    status: 'success',
    results: donations.length,
    data: {
      donations
    }
  });
});

/**
 * GET /donation/user/:id
 * @public
 */
exports.getUserDonations = catchAsync(async (req, res, next) => {
  const donations = await Donation.find({ author: req.params.id });
  if (!donations) {
    return next(new AppError('No donation found with that id', 404));
  }
  // Tour.findOne({ _id:req.params.id })
  res.status(200).json({
    result: donations.length,
    status: 'success',
    data: {
      donations
    }
  });
});
/**
 * GET /donation/:id
 * @public
 */

exports.getDonation = catchAsync(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    return next(new AppError('No donation found with that id', 404));
  }
  // Tour.findOne({ _id:req.params.id })
  res.status(200).json({
    status: 'success',
    data: {
      donation
    }
  });
});
/**
 * POST /donation
 * @public
 */

exports.createDonation = catchAsync(async (req, res, next) => {
  const visitorid = '5e642572d2508830889ec953';
  if (req.body.visitor) {
    req.body.author = visitorid;
  }
  const newDonation = await Donation.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      donation: newDonation
    }
  });
});

/**
 * PATCH /donation/:id
 * @private
 */
exports.updateDonation = catchAsync(async (req, res, next) => {
  const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!donation) {
    return next(new AppError('No donation found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      donation
    }
  });
});

/**
 * DELETE /donation/:id
 * User must own the donation to delete it !
 * @private
 */
exports.deleteDonation = catchAsync(async (req, res, next) => {
  const donation = await Donation.findByIdAndDelete(req.params.id);
  if (!donation) {
    return next(new AppError('No donation found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
