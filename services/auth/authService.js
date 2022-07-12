const { repositoryUsers } = require('../../repository');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const { randomUUID } = require('crypto');

class AuthService {
  async isUserExist(email) {
    const user = await repositoryUsers.findByEmail(email);
    return !!user;
  }

  async createUser(body) {
    const { id, name, email, role, avatarURL, verificationTokenEmail } = await repositoryUsers.create(body);
    return { id, name, email, role, avatarURL, verificationTokenEmail };
  }

  async getUser(email, password) {
    const user = await repositoryUsers.findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword || !user?.isVerification) {
      return null;
    }
    return user;
  }

  getToken(user) {
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
  }

  getRefreshToken() {
    const id = randomUUID();
    const payload = { id };
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '24h' });
    return refreshToken;
  }

  async setToken(id, token) {
    await repositoryUsers.updateToken(id, token);
  }

  async setRefreshToken(id, refreshToken) {
    await repositoryUsers.updateRefreshToken(id, refreshToken);
  }
}

module.exports = new AuthService();
