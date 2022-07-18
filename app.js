const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const { routesAuth, routesProducts, routesUsers, routesDailyCalories } = require('./routes');
const { LIMIT_JSON, LIMIT_FORM } = require('./libs');

const formatsLogger = process.env.NODE_ENV === 'development' ? 'dev' : 'short';
const app = express();
app.use(helmet());
app.use(logger(formatsLogger));
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
  }),
);
// Подключаем обработку JSON
app.use(bodyParser.json({ limit: LIMIT_JSON }));
// Подключаем обработку форм
app.use(bodyParser.urlencoded({ limit: LIMIT_FORM, extended: false }));
// Подключаем languages
app.use((req, res, next) => {
  app.set('lang', req.acceptsLanguages(['en', 'ua', 'ru']));
  next();
});
// Подключаем cookies
app.use(cookieParser());
app.use(
  session({
    name: 'slimMom-command-#1',
    secret: process.env.SESSION_SECRET_KEY,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_HOST }),
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
  }),
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', routesAuth);
app.use('/api/v1/users', routesUsers);
app.use('/api/v1/products', routesProducts);
app.use('/api/v1/dailycalories', routesDailyCalories);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
  res.send('Visits:' + req.session.numberOfVisits);
  next();
});
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
