import { signUpConstraints, signInConstraints, validateFormData} from "../middlewares/auth-validate.js";
import UserController from "../controller/UserController.js";


export default function authRoutes(app) {
    app.post('/users/sign_up', signUpConstraints, validateFormData, UserController.signUp);
    app.post('/users/sign_in', signInConstraints, validateFormData, UserController.signIn);
}