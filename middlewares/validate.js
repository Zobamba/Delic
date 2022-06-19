import { buildCheckFunction } from 'express-validator';

const checkBodyAndQuery = buildCheckFunction(['body', 'params', 'query']);

export const validParamId = [
  checkBodyAndQuery('id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('wrong id format, must be an integer'),
];