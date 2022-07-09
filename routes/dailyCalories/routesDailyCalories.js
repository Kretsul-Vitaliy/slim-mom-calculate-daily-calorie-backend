const { Router } = require('express');
const {dailyCaloriesController} = require('../../controllers');
const { guard} = require('../../middlewares');
// const {productOnDayJoiSchema } = require('../../models/productOnDayModel');

const router = new Router();

router.post('/', guard, dailyCaloriesController.addDailyCalories);

module.exports = router;
