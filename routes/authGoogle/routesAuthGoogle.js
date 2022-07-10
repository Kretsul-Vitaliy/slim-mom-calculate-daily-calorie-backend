const express = require('express');
const { validationWraperSchema, limiter } = require('../../middlewares');
const { joiUserSignUpSchema } = require('../../models/userModel');
const { LIMITIER_COUNT, LIMITIER_TIME } = require('../../libs');
const { authController } = require('../../controllers');
const router = express.Router();

router.get(
  '/google',
  limiter(LIMITIER_TIME, LIMITIER_COUNT),
  validationWraperSchema(joiUserSignUpSchema),
  authController.signupAuthGoogle,
);
router.get(
  '/google-redirect',
  limiter(LIMITIER_TIME, LIMITIER_COUNT),
  validationWraperSchema(joiUserSignUpSchema),
  authController.signupGoogleRedirect,
);

module.exports = router;
