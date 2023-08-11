/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import passwordHash from 'password-hash';
import { signJsonWebToken, getErrorMessage } from './Util.js';
import models from '../models';

const { user } = models;

class UserController {
  signUp(req, res) {
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
        message: 'User successfully created',
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
  }

  signIn(req, res) {
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
          message: 'User successfully updated',
          user: updatedUser,
        });
      }

      res.status(404).send({
        message: 'User not found',
      });
    });
  }

  getAllUsers(req, res) {
    const {
      limit, offset, admin, disable,
    } = req.query;
    const queryLimit = limit || 10;
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
    });
  }
}

export default new UserController();
