// const { Unauthorized } = require('http-errors');
const { BadRequest } = require('http-errors');
const jwt = require('jsonwebtoken');
const { SessionModel, UserModel } = require('../models');
// const { repositoryUsers } = require('../repository');
const { authService } = require('../services/auth');
const { SECRET_KEY } = process.env;

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
    // const refreshToken = req.cookies.refreshToken;
    // const sid = req.session;
    const token = req.header('authorization')?.split(' ')[1];
    // const refreshToken = req.get('authorization')?.split(' ')[2];
    const isValidToken = verifyToken(token, SECRET_KEY);
    // const isValidToken = verifyToken(refreshToken, SECRET_KEY);
    if (!isValidToken) {
      throw new BadRequest('Your token is valid');
    }
    const { id, sid } = jwt.decode(token);
    const activeSession = await SessionModel.findById(sid);
    if (!activeSession) {
      return res.status(404).send({ message: 'Invalid session' });
    }
    const user = await UserModel.findById(id);
    const session = await SessionModel.findById(sid);
    if (!user) {
      return res.status(404).send({ message: 'Invalid user' });
    }
    if (!session) {
      return res.status(404).send({ message: 'Invalid session' });
    }
    await SessionModel.findByIdAndDelete(sid);
    const newSession = await SessionModel.create({
      id: user._id,
    });
    const newAccessToken = authService.getToken(user, sid);
    const newRefreshToken = authService.getRefreshToken(user, sid);
    // const isValidRefreshToken = verifyToken(refreshToken, REFRESH_SECRET_KEY);
    // if (!isValidRefreshToken) {
    //   throw new Unauthorized('Wrong or expired token(s)');
    // }

    // const activeSession = await SessionModel.findById(req.body.sid);
    // if (!activeSession) {
    //   return res.status(404).send({ message: 'Invalid session' });
    // }
    // const { sid } = jwt.decode(token);
    // const { id } = jwt.decode(refreshToken);
    // const userAuthorizationById = await repositoryUsers.findById(id);
    // if (!userAuthorizationById || userAuthorizationById.refreshToken !== refreshToken) {
    //   throw new Unauthorized('Wrong or expired token(s)');
    // }
    // req.user = userAuthorizationById;
    // const token = jwt.sign(
    //   {
    //     id,
    //   },
    //   SECRET_KEY,
    //   { expiresIn: '1h' },
    // );
    // res.send({
    //   token,
    // });
    return res.status(200).send({ token: newAccessToken, refreshToken: newRefreshToken, sid: newSession._id });
    // next();
  } catch (error) {
    next(error);
  }
};
module.exports = refreshGuard;
