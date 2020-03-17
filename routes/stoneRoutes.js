const multer = require('multer');
const fs = require('fs');
const express = require('express');
const path = require('path');

const stoneController = require('./../controllers/stoneController');
const authController = require('./../controllers/authController');

const directory = 'uploads/';

const router = express.Router();

const upload = multer({ dest: 'uploads/', limits: { fileSize: 3000000 } });
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
  .get(stoneController.getAllStones)
  .post(
    upload.fields([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 8 }
    ]),
    stoneController.createStone,
    DeleteImagesFromUploadDirecotory
  );
router.route('/user/:id').get(stoneController.getUserStones);
router
  .route('/:id')
  .get(stoneController.getStone)
  .patch(
    authController.protect,
    stoneController.authorProtected,
    stoneController.updateStone
  )
  .delete(
    authController.protect,
    stoneController.authorProtected,
    // authController.restrictTo('admin', 'lead-guide'),
    stoneController.deleteStone
  );

module.exports = router;
