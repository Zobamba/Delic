import MealController from "../controller/MealController.js";
import { mealFormConstraints, mealUpdateFormConstraints } from "../middlewares/meal-validate";
import { validateFormData, verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled } from "../middlewares/auth-validate";
import { validParamId, validateQueryString } from '../middlewares/validate';

export default function mealRoutes(app) {
    app.post('/meals', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, mealFormConstraints, validateFormData, MealController.postMeal);
    app.get('/meals/:id', verifyAuthToken, validateToken, checkIfDisabled, validParamId, MealController.getMealById);
    app.put('/meals/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, mealUpdateFormConstraints, validateFormData, MealController.putMeal);
    app.get('/meals', verifyAuthToken, validateToken, checkIfDisabled, validateQueryString, MealController.getMeals);
    app.delete('/meals/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, MealController.deleteMeal);
}