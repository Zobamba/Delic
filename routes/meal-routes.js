import MealController from "../controller/MealController.js";
import { mealFormConstraints, mealUpdateFormConstraints } from "../middlewares/meal-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/auth-validate";
import { validParamId } from '../middlewares/validate';

export default function mealRoutes(app) {
    app.post('/meals', verifyAuthToken, validateToken, mealFormConstraints, validateFormData, MealController.postMeal);
    app.get('/meals/:id', verifyAuthToken, validateToken, validParamId, MealController.getMealById);
    app.put('/meals/:id', verifyAuthToken, validateToken, validParamId, mealUpdateFormConstraints, validateFormData, MealController.putMeal);
    app.get('/meals', verifyAuthToken, validateToken, MealController.getMeals);
    app.delete('/meals/:id', verifyAuthToken, validateToken, validParamId, MealController.deleteMeal);
}