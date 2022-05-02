import { body, validationResult } from 'express-validator';

export const validateSignUpForm = [
    body('email')
        .exists()
        .withMessage('email is required')
        .isLength({ min: 1 })
        .withMessage('email is required')
        .isEmail()
        .withMessage('email field must contain a valid email address')
        .trim(),

    body('firstName')
        .exists()
        .withMessage('firstName field is require')
        .isLength({ min: 1 })
        .withMessage('firstName field is require')
        .isString()
        .withMessage('the name must be a string')
        .trim(),

    body('lastName')
        .exists()
        .withMessage('lastName field is required')
        .isLength({ min: 1 })
        .withMessage('lastName field is required')
        .isString()
        .withMessage('the name must be a string')
        .trim(),

    body('password')
        .exists()
        .withMessage('password is required')
        .isLength({ min: 1 })
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must contain at least 8 characters'),

    body('passwordConfirmation')
        .exists()
        .withMessage('password confirmation is required')
        .isLength({ min: 1 })
        .withMessage('password confirmation is required')
        .custom((value) => {
            return value === req.body.password;
        })
        .withMessage('password confirmation should match password'),
];

export function Errors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()

        });
    }
}