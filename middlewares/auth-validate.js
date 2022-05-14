import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const signUpConstraints = [
    body('email')
        .exists()
        .withMessage('email is required')
        .isLength({ min: 1 })
        .withMessage('email is required')
        .isEmail()
        .withMessage('email field must contain a valid email address')
        .trim(),

    body('firstName')
        .exists()
        .withMessage('firstName field is require')
        .isLength({ min: 1 })
        .withMessage('firstName field is require')
        .isString()
        .withMessage('the name must be a string')
        .trim(),

    body('lastName')
        .exists()
        .withMessage('lastName field is required')
        .isLength({ min: 1 })
        .withMessage('lastName field is required')
        .isString()
        .withMessage('the name must be a string')
        .trim(),

    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 1 })
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must contain at least 8 characters'),

    body('passwordConfirmation')
        .exists()
        .withMessage('password confirmation is required')
        .isLength({ min: 1 })
        .withMessage('password confirmation is required')
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage('password confirmation should match password'),
];

export const signInConstraints = [
    body('email')
        .exists()
        .withMessage('email is required')
        .isLength({ min: 1 })
        .withMessage('email is required')
        .isEmail()
        .withMessage('email field must contain a valid email address')
        .trim(),

    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 1 })
        .withMessage('password is required')
];

export function verifyAuthToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader.split(' ')[1];
      req.token = token;
      next();
    } else {
      res.status(401).send({
        message: 'You are not authorized to consume this resource. Please sign in',
      });
    }
  }
  
  export function validateToken(req, res, next) {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        res.status(401).send({
          message: 'You are not authorized to consume this resource. Please sign in',
        });
      } else {
        req.user = authData.data;
        next();
      }
    });
  }

export const validateFormData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
