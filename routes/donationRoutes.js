const express = require('express');
const donationController = require('./../controllers/donationController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/')
  .get(donationController.getAllDonations)
  .post(donationController.createDonation);
router.route('/user/:id').get(donationController.getUserDonations);
router
  .route('/:id')
  .get(donationController.getDonation)
  .patch(authController.protect, donationController.updateDonation)
  .delete(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    donationController.deleteDonation
  );

module.exports = router;
