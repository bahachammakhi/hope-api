const multer = require('multer');

const express = require('express');
const donationController = require('./../controllers/donationController');
const authController = require('./../controllers/authController');

const upload = multer({ dest: 'uploads/', limits: { fileSize: 3000000 } });

const router = express.Router();

// router.param('id', tourController.checkID);
router
  .route('/')
  .get(donationController.getAllDonations)
  .post(
    upload.fields([{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 8 }]),
    donationController.imagesRequired,
    donationController.uploadPicstoCloudinary,
    donationController.createDonation
  );
router.route('/user/:id').get(donationController.getUserDonations);
router
  .route('/:id')
  .get(donationController.getDonation)
  .patch(authController.protect, donationController.authorProtected, donationController.updateDonation)
  .delete(
    authController.protect,
    donationController.authorProtected,
    donationController.deleteCloudinaryPics,
    donationController.deleteDonation
  );

module.exports = router;
