import { signUpConstraints, validateSignUpForm } from "../middlewares/validate.js";
import UserController from "../controller/UserController.js";


export default function authRoutes(app) {
    app.post('/users/sign_up', signUpConstraints, validateSignUpForm, UserController.signUp);
}