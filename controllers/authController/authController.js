const { Conflict, Unauthorized } = require('http-errors');
const queryString = require('query-string');
// const URL = require('url');

const { authService } = require('../../services/auth');
const { HttpStatusCode } = require('../../libs');

const { EmailService, SenderNodemailer } = require('../../services/email');
const { default: axios } = require('axios');
const { repositoryUsers } = require('../../repository');
const { createUser } = require('../../services/auth/authService');

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
      await authService.setToken(authentificationUser.id, token);

      return res.status(HttpStatusCode.OK).json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req, res, next) {
    try {
      await authService.setToken(req.user.id, null);
      res.status(HttpStatusCode.NO_CONTENT).json({
        status: 'success',
        code: HttpStatusCode.NO_CONTENT,
      });
    } catch (error) {
      next(error);
    }
  }

  async signupAuthGoogle(req, res, next) {
    try {
      const stringifieldParams = queryString.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '),
        response_tyoe: 'code',
        access_type: 'offline',
        promt: 'consent',
      });
      return res
        .status(HttpStatusCode.OK)
        .redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifieldParams}`);
    } catch (error) {
      next(error);
    }
  }

  async signupGoogleRedirect(req, res, next) {
    try {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      const urlObj = new URL(fullUrl);
      const urlParams = queryString.parse(urlObj.search);
      const code = urlParams.code;
      console.log('code', code);
      const tokenData = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
          grant_type: 'authorization_code',
          code,
        },
      });

      const userData = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
          Authorization: `Bearer ${tokenData.data.access_token}`,
        },
      });
      const { email, picture: avatarURL } = userData.data;
      const isUserExist = await authService.isUserExist(email);

      if (!isUserExist) {
        const newUser = await authService.createUser({ email, avatarURL });
        const accessToken = await authService.getToken(newUser);
        await authService.setToken(newUser.id, accessToken);
        await repositoryUsers.updateVerify(createUser.id, true);
        return res
          .status(HttpStatusCode.CREATED)
          .json({
            status: 'success',
            code: HttpStatusCode.CREATED,
            data: {
              ...newUser,
              isSendEmailVerify: true,
            },
          })
          .redirect(
            `${process.env.FRONTEND_URL}/google?email=${userData.data.email}&avatarURL=${userData.data.picture}&token=${accessToken}`,
          );
      }

      const userInDataBase = await authService.getUserFromGoogle(email);
      const accessToken = await authService.getToken(userInDataBase);
      await authService.setToken(userInDataBase.id, accessToken);

      return res
        .status(HttpStatusCode.OK)
        .json({
          status: 'success',
          code: HttpStatusCode.OK,
          data: {
            accessToken,
          },
        })
        .redirect(
          `${process.env.FRONTEND_URL}/google?email=${userInDataBase.email}&avatarURL=${userInDataBase.avatarURL}&token=${accessToken}`,
        );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
