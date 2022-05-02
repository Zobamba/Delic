import passwordHash from 'password-hash';
import { user } from '../models/index.js';
import { getErrorMessage } from './Util.js';
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
            });
          }).catch((error) => {
            res.status(400).send(getErrorMessage(error));
          });
        }
}

export default new UserController();