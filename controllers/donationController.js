const cloudinary2 = require('cloudinary').v2;
const Donation = require('./../models/donationModel');
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const deleteUploadFolder = require('../utils/deleteUploadFolder');
const catchAsync = require('./../utils/catchAsync');
const cloudinary = require('../utils/cloudinayConfig');
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
 * images Required
 * @public
 *  req.files needs to contain files.images and files.imageCover
 */

exports.imagesRequired = catchAsync(async (req, res, next) => {
  if (req.files === null) {
    return next(new AppError('Please provide a picture', 400));
  }
  if (!req.files.images) {
    return next(new AppError('Please put some images ! ', 400));
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
      donations,
    },
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
      donations,
    },
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
      donation,
    },
  });
});

/**
 * Upload image and images to cloudinary
 * @public
 */

exports.uploadPicstoCloudinary = catchAsync(async (req, res, next) => {
  //uploading images to cloudinary
  const resPromises = await req.files.images.map(
    file =>
      new Promise((resolve, eject) => {
        cloudinary(file.path, file.filename, 'donations').then(result => {
          const imagesResult = {
            secure_url: result.secure_url,
            public_id: result.public_id,
          };
          resolve(imagesResult);
        });
      })
  );
  const resultArray = await Promise.all(resPromises);
  // upload imageCover
  const result = await cloudinary(
    req.files.imageCover[0].path,
    req.files.imageCover[0].filename,
    'donations'
  );
  // took only secure url and public id from res
  const imageCoverResult = {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
  // putting urls on the body imageCover and images
  req.body.imageCover = imageCoverResult;
  req.body.images = resultArray;
  next();
});

/**
 * POST /donation
 * @public
 */

exports.createDonation = catchAsync(async (req, res, next) => {
  const exist = await User.findById(req.body.author);
  if (!exist) {
    return next(new AppError('No User found with that id', 404));
  }
  const newDonation = await Donation.create(req.body);
  deleteUploadFolder();
  res.status(201).json({
    status: 'success',
    data: {
      donation: newDonation,
    },
  });
});

/**
 * PATCH /donation/:id
 * @private
 */

exports.updateDonation = catchAsync(async (req, res, next) => {
  const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!donation) {
    return next(new AppError('No donation found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      donation,
    },
  });
});

/**
 * DELETE cloudinary pics
 * Before deleting Stone
 * @private
 */

exports.deleteCloudinaryPics = catchAsync(async (req, res, next) => {
  const { imageCover, images } = await Donation.findById(req.params.id, 'imageCover images');
  await cloudinary2.uploader.destroy(imageCover.public_id, () => {
    images.forEach(el => {
      cloudinary2.uploader.destroy(el.public_id, () => {});
    });
  });
  next();
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
    data: null,
  });
});
