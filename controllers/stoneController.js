const Stone = require('./../models/stoneModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const upload = require('../utils/multerConfig');
const cloudinary = require('../utils/cloudinayConfig');
const AppError = require('./../utils/appError');

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
      stones
    }
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
      stones
    }
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
      stone
    }
  });
});
/**
 * POST /stone
 * @public
 */

exports.createStone = catchAsync(async (req, res, next) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.send(err);
    }
    console.log('file uploaded to server');
    // console.log(req.file);

    // SEND FILE TO CLOUDINARY

    cloudinary(req.file.path).then(async result => {
      console.log('result', result.secure_url);
      req.body.imageCover = result.secure_url;
      const newStone = await Stone.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          stone: newStone
        }
      });
    });
  });
});

/**
 * PATCH /donation/:id
 * @private
 */
exports.updateStone = catchAsync(async (req, res, next) => {
  const stone = await Stone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!stone) {
    return next(new AppError('No Stone found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      stone
    }
  });
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
      deleted: true
    }
  });
});
