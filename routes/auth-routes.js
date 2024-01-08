import UserController from '../controller/UserController';
import {
  signUpConstraints, signInConstraints, updateUserConstraints, updateProfileConstraints,
  changePasswordConstraints, validateFormData, verifyAuthToken, validateToken,
  checkIfAdmin, checkIfDisabled, authSignInConstraints, pwdRecoveryEmailConstraints,
  forgotPasswordConstraints,
} from '../middlewares/auth-validate';
import { validParamId, validateQueryEmail } from '../middlewares/validate';

export default function authRoutes(app) {
  app.post('/sign_up', signUpConstraints, validateFormData, UserController.signUp, UserController.sendSignUpMail);
  app.post('/sign_in', signInConstraints, validateFormData, UserController.signIn, UserController.sendLoginMail);
  app.post('/auth_sign_in', authSignInConstraints, validateFormData, UserController.authSignIn);
  app.put('/forgot_pwd', forgotPasswordConstraints, validateFormData, UserController.forgotPassword);
  app.put('/send_pwd_recovery_email', pwdRecoveryEmailConstraints, validateFormData, UserController.sendRecoveryPasswordId, UserController.sendMail);
  app.put('/update-profile', verifyAuthToken, validateToken, checkIfDisabled, updateProfileConstraints, validateFormData, UserController.UpdateProfile);
  app.put('/change_pwd', verifyAuthToken, validateToken, checkIfDisabled, changePasswordConstraints, validateFormData, UserController.changePassword);
  app.get('/users', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, UserController.getAllUsers);
  app.get('/user', verifyAuthToken, validateToken, checkIfDisabled, UserController.getUser);
  app.get('/users/:id', validParamId, verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validateFormData, UserController.getUserByIdParam);
  app.put('/users/:id', verifyAuthToken, validateToken, checkIfAdmin, checkIfDisabled, validParamId, updateUserConstraints, validateFormData, UserController.putUser);
  app.get('/users/:email/exists', validateQueryEmail, validateFormData, UserController.getUserByEmail);
}
