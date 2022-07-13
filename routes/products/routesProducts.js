const { Router } = require('express');
const { productsController } = require('../../controllers');
const { guard, validationWraperSchema, validateQuery } = require('../../middlewares');
const { productOnDayJoiSchema } = require('../../models/productOnDayModel');
const { searchProductJoiSchema } = require('../../models/searchProductModel');

const router = new Router();

router.get('/', validateQuery(searchProductJoiSchema),  productsController.getProducts);
router.post('/', guard, validationWraperSchema(productOnDayJoiSchema), productsController.addProductOnDay);
router.delete('/:id', guard, productsController.removeProductOnDay);
router.get('/:date', guard, productsController.allProductsPerDay);

module.exports = router;
