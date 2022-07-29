import MenuController from "../controller/MenuController.js";
import { menuFormConstraints, menuUpdateFormConstraints } from "../middlewares/menu-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/auth-validate";
import { validParamId, validateQueryString } from "../middlewares/validate";

export default function menuRoutes(app) {
    app.post('/menus', verifyAuthToken, validateToken, menuFormConstraints, validateFormData, MenuController.verifyMealsInMenu, MenuController.postMenu, MenuController.mapMenuToMeals);
    app.put('/menus/:id', verifyAuthToken, validateToken, validParamId, menuUpdateFormConstraints, validateFormData, MenuController.verifyMealsInMenu, MenuController.putMenu);
    app.get('/menus/:id', verifyAuthToken, validateToken, validParamId, validateFormData, MenuController.getMenuByIdParam);
    app.get('/menus', verifyAuthToken, validateToken, validateQueryString, MenuController.getMenus);
    app.delete('/menus/:id', verifyAuthToken, validateToken, validParamId, MenuController.deleteMenu);
    app.get('/menus/user', verifyAuthToken, validateToken, validateQueryString, validateFormData, MenuController.getMenusByUserId);
}