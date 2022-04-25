import { validateSignUpForm } from "../middlewares/validate.js";
import UserController from "../controller/UserController.js";


export default function authRoutes(app) {
    app.post('/users/sign_up', validateSignUpForm, UserController.signUp);
}