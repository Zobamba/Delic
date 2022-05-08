import jwt from 'jsonwebtoken';

export function signJsonWebToken(user) {
  const token = jwt.sign({
    data: user,
}, process.env.JWT_SECRET );
  return token;
};

export function getErrorMessage(error) {
  console.log(error);
  const message = error.errors[0];
  return {
    [message.path]: error.original.message,
  };
}


