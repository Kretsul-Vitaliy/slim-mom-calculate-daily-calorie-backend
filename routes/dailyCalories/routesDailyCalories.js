const { Router } = require('express');
const {dailyCaloriesController} = require('../../controllers');
const { guard} = require('../../middlewares');


const router = new Router();

router.post('/', guard, dailyCaloriesController.addDailyCalories);
router.post('/public', dailyCaloriesController.getDailyCalories);

module.exports = router;
