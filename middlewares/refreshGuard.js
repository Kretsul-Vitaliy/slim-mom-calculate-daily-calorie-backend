const { Unauthorized, BadRequest } = require('http-errors');
const jwt = require('jsonwebtoken');
const { repositoryUsers } = require('../repository');
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const verifyToken = (token, key) => {
  try {
    const verify = jwt.verify(token, key);
    return !!verify;
  } catch (error) {
    return false;
  }
};

const refreshGuard = async (req, res, next) => {
    try {
        const token = req.get('authorization')?.split(' ')[1];
        const refreshToken = req.get('authorization')?.split(' ')[2];
        const isValidToken = verifyToken(token, SECRET_KEY);
        if (isValidToken) {
            throw new BadRequest('Your token is valid');
        }
        const isValidRefreshToken = verifyToken(refreshToken, REFRESH_SECRET_KEY);
        if (!isValidRefreshToken) {
            throw new Unauthorized('Not authorized');
        }
        const { id } = jwt.decode(token);
        const userAuthorizationById = await repositoryUsers.findById(id);
        if (!userAuthorizationById || userAuthorizationById.refreshToken !== refreshToken) {
            throw new Unauthorized('Wrong token(s)');
        }
        req.user = userAuthorizationById;
        next();
    } catch (error) {
        next(error);
    }
}
module.exports = refreshGuard;
