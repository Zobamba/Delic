import { body } from 'express-validator';

export const menuFormConstraints = [
   body('date')
      .exists()
      .withMessage('the date field is required')
      .custom(value => new Date(value).toDateString() !== 'Invalid Date')
      .withMessage('the date supplied is not a valid date')
      .isAfter()
      .withMessage('the date supplied is in the past')
      .trim(),

   body('meals')
      .exists()
      .withMessage('the meal_ids field is required')
      .isArray()
      .withMessage('the meal_ids field must be an array')
      .isLength({ min: 1 })
      .withMessage('at least one meal is needed')
      .custom(value => checkMealObjects(value))
      .withMessage('at least one of the objects in the array does not have the \'mealId\' or the id is not a valid UUID4 id')
];

export const menuUpdateFormConstraints = [
   body('date')
      .optional({ nullable: true })
      .custom(value => new Date(value).toDateString() !== 'Invalid Date')
      .withMessage('the date supplied is not a valid date')
      .trim(),

   body('meals')
      .optional({ nullable: true })
      .isArray()
      .withMessage('the meals field must an array')
      .isLength({ min: 1 })
      .withMessage('at least on meal is needed')
      .custom(value => checkMealObjects(value))
      .withMessage('at least one of the objects in the array does not have the \'mealId\' or the id is not a valid UUID4 id')
];

