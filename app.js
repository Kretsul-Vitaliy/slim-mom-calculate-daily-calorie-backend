const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');
const { routesAuth, routesProducts, routesUsers, routesDailyCalories } = require('./routes');
const { LIMIT_JSON, LIMIT_FORM } = require('./libs');

const formatsLogger = process.env.NODE_ENV === 'development' ? 'dev' : 'short';
const app = express();


app.use(helmet());
app.use(logger(formatsLogger));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Подключаем обработку JSON
app.use(express.json({ limit: LIMIT_JSON }));
// Подключаем обработку форм
app.use(express.urlencoded({ limit: LIMIT_FORM, extended: false }));
// Подключаем languages
app.use((req, res, next) => {
  app.set('lang', req.acceptsLanguages(['en', 'uk']));
  next();
});

app.use('/api/v1/auth', routesAuth);
app.use('/api/v1/users', routesUsers);
app.use('/api/v1/products', routesProducts);
app.use('/api/v1/dailycalories', routesDailyCalories);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
