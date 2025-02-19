/* eslint-disable object-curly-newline */
import MealController from '../controller/MealController.js';
import { mealFormConstraints, mealUpdateFormConstraints } from '../middlewares/meal-validate';
import { validateFormData, verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled } from '../middlewares/auth-validate';
import { validParamId } from '../middlewares/validate';

export default function mealRoutes(app) {
  app.post('/meals', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, mealFormConstraints, validateFormData, MealController.postMeal);
  app.get('/meals/:id', validParamId, MealController.getMealById);
  app.put('/meals/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, validateFormData, mealUpdateFormConstraints, validateFormData, MealController.putMeal);
  app.get('/meals', MealController.getMeals);
  app.delete('/meals/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, validateFormData, MealController.deleteMeal);
}
