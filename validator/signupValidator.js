
const { check } = require('express-validator');

class SignupValidation {

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
            check('passwordConf')
                .isLength({ min: 8 })
                .withMessage('passwordConfirm is less than 8 caracters ')

        ]

    }
}




module.exports = new SignupValidation();