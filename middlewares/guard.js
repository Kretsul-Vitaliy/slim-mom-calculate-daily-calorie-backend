const { Unauthorized } = require('http-errors');
const jwt = require('jsonwebtoken');
const { SessionModel } = require('../models');
const { repositoryUsers } = require('../repository');
const { SECRET_KEY } = process.env;

const verifyToken = token => {
  try {
    const verify = jwt.verify(token, SECRET_KEY);
    return !!verify;
  } catch (error) {
    return false;
  }
};

const guard = async (req, res, next) => {
  const accessToken = req.get('authorization')?.split(' ')[1] || '';
  const isValidToken = verifyToken(accessToken);
  try {
    if (!isValidToken) {
      throw new Unauthorized('No token provided');
    }
    const { id, sid } = jwt.decode(accessToken);
    const userAuthorizationById = await repositoryUsers.findById(id);
    const session = await SessionModel.findById(sid);
    if (!userAuthorizationById || userAuthorizationById.token !== accessToken) {
      throw new Unauthorized('Not authorized');
    }
    if (!session) {
      throw new Unauthorized('Invalid session');
    }
    req.user = userAuthorizationById;
    // если передавать сессию то контроллер
    // юзерс не работает наверно из - за того что сессия передаеться в куках
    // req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = guard;
