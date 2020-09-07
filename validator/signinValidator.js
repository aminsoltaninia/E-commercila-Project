
const { check } = require('express-validator');

class SigninValidation {

    handle() {
       
        return [
            check('email')
                .not().isEmpty()
                .withMessage('email is empty !!'),
            check('email')
                .trim()
                .normalizeEmail(),
            check('password')
                .trim()
                .isLength({ min: 8 })
                .withMessage('password is less than 8 caracters '),

        ]

    }
}




module.exports = new SigninValidation();