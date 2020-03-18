const cloudinary2 = require('cloudinary').v2;
const Stone = require('./../models/stoneModel');
const APIFeatures = require('./../utils/apiFeatures');
const deleteUploadFolder = require('../utils/deleteUploadFolder');
const catchAsync = require('./../utils/catchAsync');
const cloudinary = require('../utils/cloudinayConfig');

const AppError = require('./../utils/appError');

/**
 * Author Protected
 * @public
 *  to delete or update you need to be the owner
 */

exports.authorProtected = catchAsync(async (req, res, next) => {
  const passed = await Stone.findById(req.params.id);
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
 * GET /stones
 * @public
 */

exports.getAllStones = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Stone.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const stones = await features.query;

  res.status(200).json({
    status: 'success',
    results: stones.length,
    data: {
      stones,
    },
  });
});

/**
 * GET /stones/user/:id
 * @public
 */

exports.getUserStones = catchAsync(async (req, res, next) => {
  const stones = await Stone.find({ author: req.params.id });
  if (!stones) {
    return next(new AppError('No Stone found with that id', 404));
  }
  // Tour.findOne({ _id:req.params.id })
  res.status(200).json({
    result: stones.length,
    status: 'success',
    data: {
      stones,
    },
  });
});

/**
 * GET /stone/:id
 * @public
 */

exports.getStone = catchAsync(async (req, res, next) => {
  const stone = await Stone.findById(req.params.id);
  if (!stone) {
    return next(new AppError('No stone found with that id', 404));
  }
  // Tour.findOne({ _id:req.params.id })
  res.status(200).json({
    status: 'success',
    data: {
      stone,
    },
  });
});

/**
 * Upload image and images to cloudinary
 * @public
 */

exports.uploadPicstoCloudinary = catchAsync(async (req, res, next) => {
  const resPromises = await req.files.images.map(
    file =>
      new Promise(resolve => {
        cloudinary(file.path, file.filename, 'stones').then(result => {
          const imagesResult = {
            secure_url: result.secure_url,
            public_id: result.public_id,
          };
          resolve(imagesResult);
        });
      })
  );
  const resultArray = await Promise.all(resPromises);
  const result = await cloudinary(req.files.imageCover[0].path, req.files.imageCover[0].filename, 'stones');
  const imageCoverResult = {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
  req.body.imageCover = imageCoverResult;
  req.body.images = resultArray;
  next();
});

/**
 * POST /stone
 * @public
 */

exports.createStone = catchAsync(async (req, res, next) => {
  const newStone = await Stone.create(req.body);
  deleteUploadFolder();
  res.status(201).json({
    status: 'success',
    data: {
      stone: newStone,
    },
  });
});

/**
 * PATCH /donation/:id
 * @private
 */

exports.updateStone = catchAsync(async (req, res, next) => {
  const stone = await Stone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!stone) {
    return next(new AppError('No Stone found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      stone,
    },
  });
});

/**
 * DELETE cloudinary pics
 * Before deleting Stone
 * @private
 */

exports.deleteCloudinaryPics = catchAsync(async (req, res, next) => {
  const { imageCover, images } = await Stone.findById(req.params.id, 'imageCover images');
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

exports.deleteStone = catchAsync(async (req, res, next) => {
  const stone = await Stone.findByIdAndDelete(req.params.id);
  if (!stone) {
    return next(new AppError('No stone found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      deleted: true,
    },
  });
});
