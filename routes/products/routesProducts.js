const { Router } = require('express');
const { productsController } = require('../../controllers');
const { guard, validationWraperSchema } = require('../../middlewares');
const { productOnDayJoiSchema } = require('../../models/productOnDayModel');

const router = new Router();

router.get('/', productsController.getProducts);
router.post('/', guard, validationWraperSchema(productOnDayJoiSchema), productsController.addProductOnDay);
router.delete('/:id', guard, productsController.removeProductOnDay);
router.get('/:date', guard, productsController.allProductsPerDay);

module.exports = router;
