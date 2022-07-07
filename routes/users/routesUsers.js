const express = require('express');
const { validationWraperSchema, guard } = require('../../middlewares');
const { joiUserVerifyEmailSchema } = require('../../models/userModel');
const { usersController } = require('../../controllers');
const router = express.Router();

router.get('/current', guard, usersController.currentUser);
router.get('/verify/:token', usersController.verificationUser);
router.post(
  '/verify',
  validationWraperSchema(joiUserVerifyEmailSchema),
  usersController.repeatEmailForVerificationUser,
);

module.exports = router;
