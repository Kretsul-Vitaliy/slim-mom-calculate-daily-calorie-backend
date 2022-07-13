const { repositorySession } = require('../../repository');

class SessionService {
  async createSession(userId, userAgent) {
    return await repositorySession.createSession(userId, userAgent);
  }
}

module.exports = new SessionService();
