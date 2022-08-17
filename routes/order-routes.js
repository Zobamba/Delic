import OrdersController from "../controller/OrderController.js";
import { orderFormConstraints } from "../middlewares/order-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/auth-validate";

export default function orderRoutes(app) {
    app.post('/orders', verifyAuthToken, validateToken, orderFormConstraints, validateFormData, OrdersController.verifyMealsInOrder, OrdersController.postOrder, OrdersController.mapOrderToMeals);
}