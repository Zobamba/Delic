import MealController from "../controller/MealController.js";
import { mealFormConstraints } from "../middlewares/meal-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/auth-validate";
import { validParamId } from '../middlewares/validate';

export default function mealRoutes(app) {
    app.post('/meals', verifyAuthToken, validateToken, mealFormConstraints, validateFormData, MealController.postMeal);
    app.get('/meals/:id', verifyAuthToken, validateToken, validParamId, validateFormData, MealController.getMealById);
}