const express = require('express');
const { validationWraperSchema, guard, limiter } = require('../../middlewares');
const { joiUserLoginSchema, joiUserSignUpSchema, joiUserVerifyEmailSchema } = require('../../models/userModel');
const { LIMITIER_COUNT, LIMITIER_TIME } = require('../../libs');
const { authController } = require('../../controllers');
const router = express.Router();

router.post(
  '/signup',
  limiter(LIMITIER_TIME, LIMITIER_COUNT),
  validationWraperSchema(joiUserSignUpSchema),
  authController.signupUser,
);
router.post('/login', validationWraperSchema(joiUserLoginSchema), authController.loginUser);
router.post('/logout', guard, authController.logoutUser);
router.get('/current', guard, authController.currentUser);
router.get('/verify/:token', authController.verificationUser);
router.post('/verify', validationWraperSchema(joiUserVerifyEmailSchema), authController.repeatEmailForVerificationUser);

module.exports = router;
