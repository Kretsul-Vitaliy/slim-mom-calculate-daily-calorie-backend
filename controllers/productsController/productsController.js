const { repositoryProducts } = require('../../repository');
const { HttpStatusCode } = require('../../libs');

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
}
module.exports = new ProductsController();
