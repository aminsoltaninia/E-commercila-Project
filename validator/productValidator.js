
const { check } = require('express-validator');
const path = require('path')

class productValidation {

    handle() {
        
        return [

          
            check('title')
                 .isLength({min : 4})
                 .withMessage('min caracter for title 4 '),
            check('price')
                .toFloat()
                .isFloat({ min: 1 }),

            check('image')
                .custom(async (value) => {
                    if (!value) throw new Error('no image')
                    let fileExt = ['.png' , '.jpg' , '.jpeg' , '.svg']
                    if(!fileExt.includes(path.extname(value))) throw new Error('exname in not suported')
                })
        ]

    }
}




module.exports = new productValidation();