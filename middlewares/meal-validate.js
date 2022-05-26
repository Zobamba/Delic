import isUrl from 'is-url';
import { body } from 'express-validator';

export const mealFormConstraints = [
    body('name')
      .exists()
      .withMessage('the name field is required')
      .isLength({ min: 1 })
      .withMessage('the name field is required')
      .isString()
      .withMessage('the meal name must be a string')
      .trim(),
  
    body('category')
      .exists()
      .withMessage('the category field is required')
      .isLength({ min: 1 })
      .withMessage('the category field is required')
      .isString()
      .withMessage('the category field must be a string')
      .trim(),
  
    body('price')
      .exists()
      .withMessage('the price field is required')
      .isInt()
      .withMessage('the price field must must an integer')
      .trim(),
  
    body('imageUrl')
      .optional({ nullable: true })
      .custom(value => isUrl(value))
      .withMessage('image link must be a URL'),
  ];