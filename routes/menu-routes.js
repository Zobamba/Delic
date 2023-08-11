import MenuController from '../controller/MenuController.js';
import { menuFormConstraints, menuUpdateFormConstraints } from '../middlewares/menu-validate';
import {
  validateFormData, verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled,
} from '../middlewares/auth-validate';
import { validParamId } from '../middlewares/validate';

export default function menuRoutes(app) {
  app.post('/menus', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, menuFormConstraints, validateFormData, MenuController.verifyMealsInMenu, MenuController.postMenu, MenuController.mapMenuToMeals);
  app.put('/menus/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, menuUpdateFormConstraints, validateFormData, MenuController.verifyMealsInMenu, MenuController.putMenu, MenuController.updateMealsInMenu);
  app.get('/menus/:id', verifyAuthToken, validateToken, checkIfDisabled, validParamId, MenuController.getMenuByIdParam);
  app.get('/menus', verifyAuthToken, validateToken, checkIfDisabled, MenuController.getMenus);
  app.delete('/menus/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, MenuController.deleteMenu);
  app.get('/menusMeals', MenuController.getActiveMenusMeals);
}
