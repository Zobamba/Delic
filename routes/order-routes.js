import OrderController from "../controller/OrderController.js";
import { orderFormConstraints } from "../middlewares/order-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/auth-validate";
import { validParamId, validateQueryString } from "../middlewares/validate";

export default function orderRoutes(app) {
    app.post('/orders', verifyAuthToken, validateToken, orderFormConstraints, validateFormData, OrderController.verifyMealsInOrder, OrderController.postOrder, OrderController.mapOrderToMeals);
    app.put('/orders/:id', verifyAuthToken, validateToken, validParamId, orderFormConstraints, validateFormData, OrderController.verifyMealsInOrder, OrderController.putOrder, OrderController.updateMealsInOrder);
    app.get('/orders/:id', verifyAuthToken, validateToken, validParamId, OrderController.getOrderByIdParam);
    app.get('/orders', verifyAuthToken, validateToken, validateQueryString, OrderController.getOrders);
}