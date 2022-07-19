import MenuController from "../controller/MenuController.js";
import { menuFormConstraints } from "../middlewares/menu-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/auth-validate";

export default function menuRoutes(app) {
    app.post('/menus', verifyAuthToken, validateToken, menuFormConstraints, validateFormData, MenuController.verifyMealsInMenu, MenuController.postMenu, MenuController.mapMenuToMeals);
}