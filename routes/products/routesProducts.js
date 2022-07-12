const { Router } = require('express');
const { productsController } = require('../../controllers');
const { guard, validationWraperSchema} = require('../../middlewares');
const {productOnDayJoiSchema } = require('../../models/productOnDayModel');

const router = new Router();

router.get('/', guard, productsController.getProducts);
router.post('/', guard, validationWraperSchema(productOnDayJoiSchema), productsController.addProductOnDay);
router.delete('/:id', guard, productsController.removeProductOnDay);
router.get('/:date', guard, productsController.allProductsPerDay);
router.get('/bloodtype/:type', guard, productsController.getProductsByBloodType);


module.exports = router;
