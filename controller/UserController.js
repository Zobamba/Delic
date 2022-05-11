import passwordHash from 'password-hash';
import { user } from '../models/index.js';
import {  signJsonWebToken, getErrorMessage } from './Util.js';

class UserController {
  signUp(req, res) {
    user.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      passwordHash: passwordHash.generate(req.body.password),
    }).then((usr) => {
      res.status(201).send({
        id: usr.id,
        firstName: usr.firstName,
        lastName: usr.lastName,
        email: usr.email,
        message: 'User successfully created',
        token: signJsonWebToken(usr),
      });
    }).catch((error) => {
      res.status(401).send(getErrorMessage(error));
    });
  } 
  
  signIn(req, res) {
    user.findOne({ where: { 
      email: req.body.email
    }}).then((usr) => {
      if (usr === null) {
        return res.status(401).send({ message: 'User not found' })
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

      res.status(401).send({ message: 'User not found' })
    }).catch((error) => {
      res.status(401).send(getErrorMessage(error));
    });
  }
}

export default new UserController();