const { SessionModel } = require('../models');

const createSession = async (userId, userAgent) => {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session;
};

module.exports = {
  createSession,
};
