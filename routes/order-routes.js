import OrderController from '../controller/OrderController.js';
import { orderFormConstraints } from '../middlewares/order-validate';
import {
  validateFormData, verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled,
} from '../middlewares/auth-validate';
import { validParamId } from '../middlewares/validate';

export default function orderRoutes(app) {
  app.post('/orders', verifyAuthToken, validateToken, checkIfDisabled, orderFormConstraints, validateFormData, OrderController.verifyMealsInOrder, OrderController.postOrder, OrderController.mapOrderToMeals);
  app.put('/orders/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, validateFormData, orderFormConstraints, validateFormData, OrderController.verifyMealsInOrder, OrderController.putOrder, OrderController.updateMealsInOrder);
  app.get('/orders/:id', verifyAuthToken, validateToken, checkIfDisabled, validParamId, validateFormData, OrderController.getOrderByIdParam);
  app.get('/orders', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, OrderController.getOrders);
  app.get('/last-ten-orders', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, OrderController.getLastTenOrders);
  app.delete('/orders/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, validateFormData, OrderController.deleteOrder);
}
