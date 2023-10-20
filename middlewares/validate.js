/* eslint-disable import/prefer-default-export */
import { buildCheckFunction, param } from 'express-validator';

const checkBodyAndQuery = buildCheckFunction(['body', 'params', 'query']);

export const validParamId = [
  param('id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('wrong id format, must be an integer'),
];

export const validateQueryEmail = [
  checkBodyAndQuery('email')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('must be a valid email address'),
];

export const validateQueryString = [
  checkBodyAndQuery('limit')
    .optional({ nullable: true })
    .isInt()
    .withMessage('the limit field must be an integer')
    .custom((value) => value > 0)
    .withMessage('the limit field must be a positive integer'),
  checkBodyAndQuery('offset')
    .optional({ nullable: true })
    .isInt()
    .withMessage('the offset field must be an integer')
    .custom((value) => value > -1)
    .withMessage('the offset field must be a positive integer'),
];
