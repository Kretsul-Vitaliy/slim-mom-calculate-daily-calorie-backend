const { Conflict, Unauthorized } = require('http-errors');

const { authService } = require('../../services/auth');
const { HttpStatusCode } = require('../../libs');

const { EmailService, SenderNodemailer } = require('../../services/email');

const { sessionService } = require('../../services/session');

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

  async signupAuthGoogle(req, res, next) {
    // const link = 'http://localhost:5000';
    try {
      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const options = {
        redirect_uri: `${process.env.BASE_URL}/api/v1/auth/google-redirect`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        promt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '),
      };
      const qs = new URLSearchParams(options);
      return res.redirect(`${rootUrl}?${qs.toString()}`);
    } catch (error) {
      next(error);
    }
  }

  async signupGoogleRedirect(req, res, next) {
    // const linkFront = 'http://localhost:3000';

    try {
      // get the code from qs
      const code = req.query.code;
      const { id_token: idToken, access_token: accessingToken } = await authService.getGoogleOAuthToken(code);
      // get user with tokens
      const googleUser = await authService.getGoogleUser(idToken, accessingToken);
      if (!googleUser.verified_email) {
        return res.status(403).send('Google account is not verified');
      }
      // upsert the user
      const isUserExist = await authService.isUserExist(googleUser.email);
      if (isUserExist) {
        const userInDataBase = await authService.getUserFromGoogle(googleUser.email);
        const accessToken = await authService.getToken(userInDataBase);
        await authService.setToken(userInDataBase.id, accessToken);
        const sendUser = JSON.stringify({
          name: userInDataBase.name,
          email: userInDataBase.email,
          avatarURL: userInDataBase.avatarURL,
          token: accessToken,
        });
        return res.redirect(`${process.env.FRONTEND_URL}/google?user=${sendUser}`);
      }
      const user = await authService.createUserGoogle({
        email: googleUser.email,
        name: googleUser.name,
        password: googleUser.id,
        avatarURL: googleUser.picture,
        isVerification: true,
        verificationTokenEmail: null,
      });

      const accessToken = await authService.getToken(user);
      await authService.setToken(user.id, accessToken);
      const sendUser = JSON.stringify({
        name: user.name,
        email: user.email,
        avatarURL: user.avatarURL,
        token: accessToken,
      });

      // create a session
      const session = await sessionService.createSession(user._id, req.get('user-agent') || '');

      // create an access token
      const accessTokenCookie = authService.signJwtAccess({ ...user, session: session._id });

      // create a refresh token
      const refreshTokenCookie = authService.signJwtRefresh({ ...user, session: session._id });

      // set cookies
      const accessTokenCookieOptions = {
        maxAge: 900000, // 1 hours
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        sameSite: 'lax',
        secure: false,
      };

      const refreshTokenCookieOptions = {
        ...accessTokenCookieOptions,
        maxAge: 3.154e10, // 1 year
      };

      res.cookie('accessToken', accessTokenCookie, accessTokenCookieOptions);

      res.cookie('refreshToken', refreshTokenCookie, refreshTokenCookieOptions);

      // redirect back to client
      return res.redirect(`${process.env.FRONTEND_URL}/google?user=${sendUser}`);
    } catch (error) {
      // next(error);
      console.error(error);
      return res.redirect(`${process.env.FRONTEND_URL}/google/error`);
    }
  }
        })
      } catch (error) {
      next(error);
    }
  }

  async refreshUserAccessToken(req, res, next) {
    try {
      const token = authService.getToken(req.user);
      await authService.setToken(req.user.id, token);

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

}

module.exports = new AuthController();
