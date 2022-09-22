/* eslint-disable object-curly-newline */
import UserController from '../controller/UserController';
import { signUpConstraints, signInConstraints, updateUserConstraints, validateFormData, verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled } from '../middlewares/auth-validate';
import { validParamId, validateQueryString } from '../middlewares/validate';

export default function authRoutes(app) {
  app.post('/users/sign_up', signUpConstraints, validateFormData, UserController.signUp);
  app.post('/users/sign_in', signInConstraints, validateFormData, UserController.signIn);
  app.put('/users/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, updateUserConstraints, validateFormData, UserController.putUser);
  app.get('/users', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validateQueryString, UserController.getAllUsers);
  app.get('/users/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, UserController.getUserByIdParam);
}
