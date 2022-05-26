import MealController from "../controller/MealController.js";
import { mealFormConstraints } from "../middlewares/meal-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/auth-validate";

export default function mealRoutes(app) {
    app.post('/meals', verifyAuthToken, validateToken, mealFormConstraints, validateFormData, MealController.postMeal);
}