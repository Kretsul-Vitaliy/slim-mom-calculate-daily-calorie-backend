const { productsController } = require('./productsController');
const { authController } = require('./authController');
const { usersController } = require('./usersController');
const {dailyCaloriesController} = require('./dailyCaloriesController')

module.exports = {
  productsController,
  authController,
  usersController,
  dailyCaloriesController
};
