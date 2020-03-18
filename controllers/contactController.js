const Contact = require('./../models/contactModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const contacts = await features.query;

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts,
    },
  });
});
exports.createContact = catchAsync(async (req, res, next) => {
  const newContact = await Contact.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      contact: newContact,
    },
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return next(new AppError('No Contact found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
