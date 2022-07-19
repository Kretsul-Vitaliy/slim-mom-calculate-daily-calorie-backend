const { repositoryProducts,repositoryDailyCalories, repositorySummaryCalories } = require('../../repository');
const { HttpStatusCode } = require('../../libs');
const {formulaLeftCalories} = require('../../util/formulaLeftCalories');
const {formulaDailtRate} = require('../../util/formulaDailyRate');
const { NotFound } = require('http-errors');

class ProductsController {
  async getProducts(req, res, next) {
    const { page = 1, limit = 100, search } = req.query;
    try {
      const products = await repositoryProducts.getProductsQuery(search, page, limit);
      
      res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          ...products,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async addProductOnDay(req, res, next) {
    try {
      const userId = req.user.id;
      const body = req.body;
      const product = await repositoryProducts.addProduct(userId, body);
      res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          ...product,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async removeProductOnDay(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const product = await repositoryProducts.removeProduct(id, userId);

      if (!product) {
        throw new NotFound('Cannot remove with ID');
      }

      res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          ...product,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async allProductsPerDay(req, res, next) {
    try {
      const userId = req.user.id;
      const { date } = req.params;
      const {products,summaryCalories:summaryCaloriesPerDay} = await repositoryProducts.getAllProductsPerDay(date, userId);

      if (products && summaryCaloriesPerDay) {
        const {calories:dailyCalories} = await repositoryDailyCalories.getDailyCaloriesAndCategories(userId);
        const LeftCalories = formulaLeftCalories(dailyCalories,summaryCaloriesPerDay);
        const percentsOfDailyRate = formulaDailtRate(dailyCalories, LeftCalories);
        const params = {date, userId, summaryCaloriesPerDay, dailyCalories, LeftCalories, percentsOfDailyRate};
        const statisticalByDay = await repositorySummaryCalories.addSummaryCalories(params);

        return res.json({
          status: 'success',
          code: HttpStatusCode.OK,
          data: [...products],
          statisticalByDay
        });
      }

      res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: [],
      });

    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ProductsController();
