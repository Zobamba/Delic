import { body } from 'express-validator';

export const orderFormConstraints = [
    body('phoneNumber')
        .exists()
        .withMessage('the phone number field is required')
        .isLength({ min: 1 })
        .withMessage('the phone number field is required')
        .isString()
        .withMessage('the phone number field must be a string')
        .trim(),

    body('address')
        .exists()
        .withMessage('the address field is required')
        .isLength({ min: 1 })
        .withMessage('the address field is required')
        .isString()
        .withMessage('the address field must be a string')
        .trim(),

    body('meals')
        .exists()
        .withMessage('the meals field is require')
        .isArray()
        .withMessage('the meals field must must an array')
        .isLength({ min: 1 })
        .withMessage('at least one meal is needed')
        .custom((value) => {
            let noErrors = true;
            for (let i = 0; i < value.length; i += 1) {
                if (value[i].units === undefined || typeof value[i].units !== 'number') {
                    noErrors = false;
                    break;
                }
            }
            return noErrors;
        })
        .withMessage('you have not specified the unit of a meal. It is also possible you have supplied a unit that is not a number.')
];