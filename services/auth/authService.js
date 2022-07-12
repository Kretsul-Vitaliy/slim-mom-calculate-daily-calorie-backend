const { repositoryUsers } = require('../../repository');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
// const config = require('config');
const { default: axios } = require('axios');
const qs = require('qs');

class AuthService {
  async isUserExist(email) {
    const user = await repositoryUsers.findByEmail(email);
    return !!user;
  }

  async createUser(body) {
    const { id, name, email, role, avatarURL, verificationTokenEmail } = await repositoryUsers.create(body);
    return { id, name, email, role, avatarURL, verificationTokenEmail };
  }

  async createUserGoogle(body) {
    const { id, name, email, avatarURL } = await repositoryUsers.create(body);
    return { id, name, email, avatarURL };
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

  signJwtAccess(object) {
    return jwt.sign(object, SECRET_KEY, { expiresIn: '1h' });
  }

  signJwtRefresh(object) {
    return jwt.sign(object, SECRET_KEY, { expiresIn: '1y' });
  }

  getTokenRefresh(user) {
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' });
    return token;
  }

  async setToken(id, token) {
    await repositoryUsers.updateToken(id, token);
  }

  async getUserFromGoogle(email) {
    const user = await repositoryUsers.findByEmail(email);
    return user;
  }

  async getGoogleOAuthToken(code) {
    // const link = 'http://localhost:5000';
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/v1/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    };
    try {
      const res = await axios.post(url, qs.stringify(values));
      return res.data;
    } catch (error) {
      console.error(error, 'Failed to fetch Google Oauth Tokens');
      throw new Error(error.message);
    }
  }

  async getGoogleUser(idToken, accessToken) {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.error(error, 'Error fetching Google user');
      throw new Error(error.message);
    }
  }

  async findAndUpdateUserGoogle(query, update) {
    return repositoryUsers.updateGoogleUser(query, update);
  }
}

module.exports = new AuthService();
