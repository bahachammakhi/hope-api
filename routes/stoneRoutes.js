const express = require('express');
const stoneController = require('./../controllers/stoneController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/')
  .get(stoneController.getAllStones)
  .post(stoneController.createStone);
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
