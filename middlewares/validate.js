import { buildCheckFunction } from 'express-validator';

const checkBodyAndQuery = buildCheckFunction(['body', 'params', 'query']);

export const validParamId = [
  checkBodyAndQuery('id')
    .isInt()
    .withMessage('wrong id format, must be an integer'),
];
