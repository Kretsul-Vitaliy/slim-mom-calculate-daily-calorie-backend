const { repositoryProducts } = require('../../repository');
const { HttpStatusCode } = require('../../libs');
const { NotFound} = require('http-errors');

class ProductsController {
  
  async getProducts(req, res, next) {
    try {
      const products = await repositoryProducts.getProductsQuery(req.query.search);
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
      const {id} = req.params;
      const product = await repositoryProducts.removeProduct(id, userId);

      if(!product) {
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
      const {date} = req.params;
      const product = await repositoryProducts.getAllProducts(date, userId);
      if(!product) {
        throw new NotFound('Not found product by date');
      }

      res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: [...product]
      });

    } catch (error) {
      next(error);
    }
  }

}
module.exports = new ProductsController();
