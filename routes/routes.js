import authRoutes from './auth-routes';
import mealRoutes from './meal-routes';

export default function routes(app) {
    authRoutes(app);
    mealRoutes(app);
}
