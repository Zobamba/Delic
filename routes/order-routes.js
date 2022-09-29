import OrderController from '../controller/OrderController.js';
import { orderFormConstraints } from '../middlewares/order-validate';
import {
  validateFormData, verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled,
} from '../middlewares/auth-validate';
import { validParamId, validateQueryString } from '../middlewares/validate';

export default function orderRoutes(app) {
  app.post('/orders', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, orderFormConstraints, validateFormData, OrderController.verifyMealsInOrder, OrderController.postOrder, OrderController.mapOrderToMeals);
  app.put('/orders/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, orderFormConstraints, validateFormData, OrderController.verifyMealsInOrder, OrderController.putOrder, OrderController.updateMealsInOrder);
  app.get('/orders/:id', verifyAuthToken, validateToken, checkIfDisabled, validParamId, OrderController.getOrderByIdParam);
  app.get('/orders', verifyAuthToken, validateToken, checkIfDisabled, validateQueryString, OrderController.getOrders);
  app.delete('/orders/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, OrderController.deleteOrder);
}
