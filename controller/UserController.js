/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import passwordHash from 'password-hash';
import { v4 as uuidv4 } from 'uuid';
import {
  signJsonWebToken, getErrorMessage, sendEmail, sendSignUpEmail, sendLoginEmail,
} from '../utils/Util';
import models from '../models';

const { user } = models;

class UserController {
  signUp(req, res, next) {
    user.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      passwordHash: passwordHash.generate(req.body.password),
    }).then((usr) => {
      res.status(201).send({
        id: usr.id,
        firstName: usr.firstName,
        lastName: usr.lastName,
        email: usr.email,
        phoneNumber: usr.phoneNumber,
        message: 'User created successfully',
        token: signJsonWebToken(usr),
      });
    }).catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({
          message: `A user with the email '${req.body.email}' already exists`,
        });
      }

      res.status(400).send({
        message: 'An error occurred while trying to sign up. Please try again',
      });
    });
    return next();
  }

  signIn(req, res, next) {
    user.findOne({
      where: {
        email: req.body.email,
      },
    }).then((usr) => {
      if (usr === null) {
        return res.status(401).send({ message: 'User not found' });
      }

      if (passwordHash.verify(req.body.password, usr.passwordHash)) {
        return res.status(201).send({
          id: usr.id,
          firstName: usr.firstName,
          lastName: usr.lastName,
          email: usr.email,
          message: 'Sign in successful',
          token: signJsonWebToken(usr),
        });
      }

      res.status(401).send({ message: 'User not found' });
    }).catch((error) => {
      res.status(401).send(getErrorMessage(error));
    });

    return next();
  }

  authSignIn(req, res) {
    user.findOne({
      where: {
        email: req.body.email,
      },
    }).then((usr) => {
      if (usr === null) {
        user.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        }).then((createdUser) => {
          res.status(201).send({
            id: createdUser.id,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            message: 'User created successfully',
            token: signJsonWebToken(createdUser),
          });
        }).catch((error) => {
          if (error) {
            return res.status(401).send(getErrorMessage(error));
          }

          res.status(400).send({
            message: 'An error occurred while trying to sign up. Please try again',
          });
        });
      }

      if (usr) {
        return res.status(201).send({
          id: usr.id,
          firstName: usr.firstName,
          lastName: usr.lastName,
          email: usr.email,
          message: 'Sign in successful',
          token: signJsonWebToken(usr),
        });
      }
    }).catch((error) => {
      res.status(401).send(getErrorMessage(error));
    });
  }

  putUser(req, res) {
    user.update(
      {
        admin: req.body.admin,
        disable: req.body.disable,
        userId: req.user.id,
      },
      {
        where: { id: req.params.id }, returning: true,
      },
    ).then((updated) => {
      const updatedUser = updated[1][0];

      if (updatedUser) {
        return res.status(200).send({
          message: 'User updated successfully',
          user: updatedUser,
        });
      }

      res.status(404).send({
        message: 'User not found',
      });
    });
  }

  UpdateProfile(req, res) {
    user.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        photoUrl: req.body.photoUrl,
      },
      { where: { id: req.user.id } },
    ).then((updated) => {
      if (updated) {
        return res.status(200).send({
          message: 'Profile updated successfully',
        });
      }
    });
  }

  getAllUsers(req, res) {
    const {
      limit, offset, admin, disable,
    } = req.query;
    const queryLimit = limit;
    const queryOffset = offset || 0;
    const whereClause = {};

    if (admin !== undefined) {
      whereClause.admin = admin;
    }

    if (disable !== undefined) {
      whereClause.disable = disable;
    }

    user.count().then((count) => {
      user.findAll({
        where: whereClause,
        limit: queryLimit,
        offset: queryOffset,
        order: [['id', 'ASC']],
      }).then((users) => {
        res.status(200).send({
          users,
          count,
          limit: queryLimit,
          offset: queryOffset,
        });
      }).catch((error) => {
        if (error.name === 'SequelizeDatabaseError') {
          return res.status(400).send({
            message: 'The limit or offset field(s) must be an integer',
          });
        }
      });
    });
  }

  getUserByIdParam(req, res) {
    user.findOne({
      where: { id: req.params.id },
    }).then((responseData) => {
      if (responseData) {
        res.status(200).send({ user: responseData });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    }).catch((error) => {
      if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).send({
          message: 'wrong id format, must be an integer',
        });
      }
    });
  }

  getUserByEmail(req, res) {
    user.findOne({
      where: { email: req.params.email },
    }).then((responseData) => {
      if (responseData) {
        res.status(200).send({ user: responseData });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    });
  }

  getUser(req, res) {
    user.findOne({
      where: { id: req.user.id },
    }).then((responseData) => {
      if (responseData) {
        res.status(200).send({ user: responseData });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    });
  }

  changePassword(req, res) {
    user.findOne({
      where: {
        id: req.user.id,
      },
    }).then((usr) => {
      if (passwordHash.verify(req.body.currentPassword, usr.passwordHash)) {
        user.update(
          {
            passwordHash: passwordHash.generate(req.body.newPassword),
          },
          {
            where: {
              id: req.user.id,
            },
          },
        ).then((changedPassword) => {
          if (changedPassword) {
            return res.status(200).send({
              message: 'Password changed successfully',
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Wrong password',
        });
      }
    });
  }

  forgotPassword(req, res) {
    const { recoveryPasswordId } = req.query;

    user.findOne({
      where: {
        recoveryPasswordId,
      },
    }).then((usr) => {
      if (usr) {
        user.update(
          {
            passwordHash: passwordHash.generate(req.body.newPassword),
            recoveryPasswordId: null,
          },
          {
            where: {
              id: usr.id,
            },
          },
        ).then((changedPassword) => {
          if (changedPassword) {
            return res.status(200).send({
              message: 'Your new Password has been created successfully',
            });
          }
        });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    });
  }

  sendRecoveryPasswordId(req, res, next) {
    user.update(
      {
        recoveryPasswordId: uuidv4(),
      },
      {
        where: { email: req.body.recipientEmail }, returning: true,
      },
    ).then((updated) => {
      const updatedUser = updated[1][0];

      if (updatedUser) {
        return next();
      }

      res.status(404).send({
        message: 'User not found',
      });
    });
  }

  sendMail(req, res) {
    sendEmail(req.body)
      .then((response) => res.status(200).send(response))
      .catch((error) => res.status(404).send({ message: error.message }));
  }

  sendSignUpMail(req, res) {
    const { firstName, email } = req.body;
    sendSignUpEmail({ firstName, recipientEmail: email })
      .then()
      .catch((error) => {
        res.status(404).send({ message: error.message });
      });
  }

  sendLoginMail(req, res) {
    const { email } = req.body;
    sendLoginEmail({ recipientEmail: email })
      .then()
      .catch((error) => {
        res.status(404).send({ message: error.message });
      });
  }
}

export default new UserController();
