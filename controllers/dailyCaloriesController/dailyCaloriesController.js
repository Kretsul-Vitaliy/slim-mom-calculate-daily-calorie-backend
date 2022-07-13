const { repositoryDailyCalories } = require('../../repository');
const { HttpStatusCode } = require('../../libs');

class DailyCaloriesController {

  async addDailyCalories(req, res, next) {
    try {
      
      const body = req.body;
      const {id} = req.user;

      const dailyCalories = await repositoryDailyCalories.addDailyCalories(body, id);

      res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          ...dailyCalories,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDailyCalories(req, res, next) {
    try {
      
      const body = req.body;

      const dailyCalories = await repositoryDailyCalories.getDailyCalories(body);

      res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          ...dailyCalories,
        },
      });
    } catch (error) {
      next(error);
    }
  }

}
module.exports = new DailyCaloriesController();
