import { buildCheckFunction } from 'express-validator';

const checkBodyAndQuery = buildCheckFunction(['body', 'params', 'query']);

export const validParamId = [
  checkBodyAndQuery('id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('wrong id format, must be an integer'),
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
  checkBodyAndQuery('expiredAt')
    .optional({ nullable: true })
    .custom((value) => new Date(value).toDateString() !== 'Invalid Date')
    .withMessage('the date field must be a valid date'),
];
