const multer = require('multer');

const express = require('express');

const stoneController = require('./../controllers/stoneController');
const authController = require('./../controllers/authController');

const router = express.Router();

const upload = multer({ dest: 'uploads/', limits: { fileSize: 3000000 } });
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(stoneController.getAllStones)
  .post(
    upload.fields([{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 8 }]),
    stoneController.imagesRequired,
    stoneController.uploadPicstoCloudinary,
    stoneController.createStone
  );
router.route('/user/:id').get(stoneController.getUserStones);
router
  .route('/:id')
  .get(stoneController.getStone)
  .patch(authController.protect, stoneController.authorProtected, stoneController.updateStone)
  .delete(
    authController.protect,
    stoneController.authorProtected,
    stoneController.deleteCloudinaryPics,
    // authController.restrictTo('admin', 'lead-guide'),
    stoneController.deleteStone
  );

module.exports = router;
