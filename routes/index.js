const routesAuth = require('./auth/routesAuth');
const routesProducts = require('./products/routesProducts');
const routesUsers = require('./users/routesUsers');
const routesDailyCalories = require('./dailyCalories/routesDailyCalories');
const routesAuthGoogle = require('./authGoogle/routesAuthGoogle');

module.exports = { routesProducts, routesAuth, routesUsers, routesDailyCalories, routesAuthGoogle };
