import { signUpConstraints, signInConstraints, validateAuthForm } from "../middlewares/auth-validate.js";
import UserController from "../controller/UserController.js";


export default function authRoutes(app) {
    app.post('/users/sign_up', signUpConstraints, validateAuthForm, UserController.signUp);
    app.post('/users/sign_in', signInConstraints, validateAuthForm, UserController.signIn);
}