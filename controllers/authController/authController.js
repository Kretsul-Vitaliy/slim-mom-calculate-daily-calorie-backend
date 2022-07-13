const { Conflict, Unauthorized } = require('http-errors');
const { authService } = require('../../services/auth');
const { HttpStatusCode } = require('../../libs');

const { EmailService, SenderNodemailer } = require('../../services/email');

class AuthController {
  async signupUser(req, res, next) {
    try {
      const { email } = req.body;
      const isUserExist = await authService.isUserExist(email);

      if (isUserExist) {
        throw new Conflict(`Email ${email} is already exist`);
      }

      const newUser = await authService.createUser(req.body);
      const emailService = new EmailService(process.env.NODE_ENV, new SenderNodemailer());
      const isSend = await emailService.sendVerifyEmail(email, newUser.name, newUser.verificationTokenEmail);
      delete newUser.verificationTokenEmail;
      return res.status(HttpStatusCode.CREATED).json({
        status: 'success',
        code: HttpStatusCode.CREATED,
        data: {
          ...newUser,
          isSendEmailVerify: isSend,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const authentificationUser = await authService.getUser(email, password);

      if (!authentificationUser) {
        throw new Unauthorized(`Email or password is wrong`);
      }

      const token = authService.getToken(authentificationUser);
      const refreshToken = authService.getRefreshToken();

      await authService.setToken(authentificationUser.id, token);
      await authService.setRefreshToken(authentificationUser.id, refreshToken);

      return res.status(HttpStatusCode.OK).json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          token,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req, res, next) {
    try {
      await authService.setToken(req.user.id, null);
      await authService.setRefreshToken(req.user.id, null);
      
      res.status(HttpStatusCode.NO_CONTENT).json({
        status: 'success',
        code: HttpStatusCode.NO_CONTENT,
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AuthController();
