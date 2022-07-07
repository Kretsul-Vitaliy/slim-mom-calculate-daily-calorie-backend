const { Router } = require('express');
const { productsController } = require('../../controllers');
const { guard } = require('../../middlewares');

const router = new Router();

router.get('/', guard, productsController.getProducts);

module.exports = router;
