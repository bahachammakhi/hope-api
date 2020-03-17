const multer = require('multer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const donationController = require('./../controllers/donationController');
const authController = require('./../controllers/authController');

const upload = multer({ dest: 'uploads/', limits: { fileSize: 3000000 } });

const router = express.Router();
const directory = 'uploads/';
// router.param('id', tourController.checkID);
const DeleteImagesFromUploadDirecotory = () => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      // eslint-disable-next-line no-shadow
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    });
  });
};
router
  .route('/')
  .get(donationController.getAllDonations)
  .post(
    upload.fields([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 8 }
    ]),
    donationController.createDonation,
    DeleteImagesFromUploadDirecotory
  );
router.route('/user/:id').get(donationController.getUserDonations);
router
  .route('/:id')
  .get(donationController.getDonation)
  .patch(
    authController.protect,
    donationController.authorProtected,
    donationController.updateDonation
  )
  .delete(
    authController.protect,
    donationController.authorProtected,
    donationController.deleteDonation
  );

module.exports = router;
