import authRoutes from './auth-routes';
import mealRoutes from './meal-routes';
import menuRoutes from './menu-routes';

export default function routes(app) {
    authRoutes(app);
    mealRoutes(app);
    menuRoutes(app);
}