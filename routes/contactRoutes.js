const express = require('express');
const contactController = require('./../controllers/contactController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, contactController.getAllContacts)
  .post(contactController.createContact);

router
  .route('/:id')
  .delete(authController.protect, contactController.deleteContact);

module.exports = router;
