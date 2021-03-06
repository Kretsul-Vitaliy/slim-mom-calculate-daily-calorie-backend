const { BadRequest, ServiceUnavailable } = require('http-errors');
const { HttpStatusCode } = require('../../libs');
const { repositoryUsers, repositoryDailyCalories } = require('../../repository');
const { authService } = require('../../services/auth');
const { EmailService, SenderNodemailer } = require('../../services/email');
const jwt = require('jsonwebtoken');

class UsersController {
  async currentUser(req, res, next) {
    const { name, email, userData, id, avatarURL, role } = req.user;
    const { sid } = jwt.decode(req.user.token);
    const getCaloriesAndCategories= await repositoryDailyCalories.getDailyCaloriesAndCategories(id);

    try {
      if(!getCaloriesAndCategories) {
        return res.json({
          status: 'success',
          code: HttpStatusCode.OK,
          data: {
            user: {
              name,
              email,
              userData: { ...userData, calories:null, categories:null},
              id,
              avatarURL,
              role,
            },
          },
          sid,
        });
      }

      const {calories, categories } = getCaloriesAndCategories;
      const userDataAndDailyCalories = { ...userData, calories, categories };

       res.json({
        status: 'success',
        code: HttpStatusCode.OK,
        data: {
          user: {
            name,
            email,
            userData: userDataAndDailyCalories,
            id,
            avatarURL,
            role,
          },
        },
        sid,
      });
      
  


    } catch (error) {
      next(error);
    }
  }

  async verificationUser(req, res, next) {
    try {
      const verifyToken = req.params.token;
      const userFromToken = await repositoryUsers.findByVerifyToken(verifyToken);
      if (userFromToken) {
        await repositoryUsers.updateVerify(userFromToken.id, true);
        const token = await authService.getToken(userFromToken);
        await authService.setToken(userFromToken.id, token);
        return res.status(HttpStatusCode.OK).redirect(`${process.env.FRONTEND_URL}/login`);
        // .json({ status: 'success', code: HttpStatusCode.OK, data: { message: 'Verification successful' } })

        //  .redirect(`${process.env.FRONTEND_URL}/google?email=${userFromToken.email}&token=${token}`)
      }
      throw new BadRequest('User not found');
    } catch (error) {
      next(error);
    }
  }

  async repeatEmailForVerificationUser(req, res, next) {
    try {
      const { email } = req.body;
      const user = await repositoryUsers.findByEmail(email);

      if (user) {
        const { email, name, verificationTokenEmail } = user;
        const emailService = new EmailService(process.env.NODE_ENV, new SenderNodemailer());
        const isSend = await emailService.sendVerifyEmail(email, name, verificationTokenEmail);

        if (isSend && verificationTokenEmail !== null) {
          return res.status(HttpStatusCode.OK).json({
            status: 'success',
            code: HttpStatusCode.OK,
            data: {
              name,
              email,
              isSendEmailVerify: isSend,
            },
          });
        }
        throw new ServiceUnavailable('Service Unavailable');
      }
      throw new BadRequest('Verification has already been passed');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController();
