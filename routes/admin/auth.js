const express = require('express');
const router = express.Router(); 
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt)
const { validationResult } = require('express-validator');
const User = require('./../../models/user')

// validator 

const signupValidator = require('./../../validator/signupValidator')
const signinValidator = require('./../../validator/signinValidator')


router.get('/signup', async (req, res) => {

       let title = 'signup page'
       
       res.render('./admin/signup.ejs' , { title ,  messages : req.flash('errors')});
})



// bodyParser.urlencoded([options])
// Returns middleware that only parses urlencoded bodies and only looks at requests
//  where the Content-Type header matches the type option.
//  This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.

// A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
//  This object will contain key-value pairs, where the value can be a string or array (when extended is false), 
//  or any type (when extended is true).

router.post('/signup', signupValidator.handle() , async (req, res) => {
    const errors = validationResult(req).array()
    if(errors.length>0){
        
         
         let messageError = []
         for (const element of errors) {
              messageError.push(element.msg)
         }
         req.flash('errors' , messageError)
        
         return res.redirect('/signup')
         
    } 

    let { email, password, passwordConf } = req.body;
    
    let user = await User.findOne({ email })
    if (user) {
         req.flash('errors' , 'user is found')
         return res.redirect('/signup')
    }

    if (password !== passwordConf){
         req.flash('errors','password and confPassword arnt equal ')
         return res.redirect('/signup')
    } 
    let salt = crypto.randomBytes(8).toString('hex')

    const hashPass = await scrypt(password, salt, 64)
    const newUser = new User({
        email,
        password: hashPass.toString('hex') + `.${salt}`
    })
    req.session.userId = newUser._id;

    await newUser.save((err) => {
        if (err) throw err;
    });
    res.redirect('/signin')
})

router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/')
})

router.get('/signin', (req, res) => {
    let title = 'singin page'
    res.render('./admin/signin.ejs' , {title ,  messages : req.flash('errors')})
})

router.post('/signin',signinValidator.handle(),async (req, res) => {
    const errors = validationResult(req).array()
    if(errors.length>0){
        
        
        let messageError = []
        for (const element of errors) {
             messageError.push(element.msg)
        }
        req.flash('errors' , messageError)
       
        return res.redirect('/signin')
        
   } 
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user){
        req.flash('errors' , 'user not exist')
        return res.redirect('/signin')
    } 
    const [oldPass, salt] = user.password.split('.')

    const supliedPass = await scrypt(password, salt, 64);

    

    if (supliedPass.toString('hex') !== oldPass){
        req.flash('errors' , 'incorect information')
        return res.redirect('/signin')
    } 
    if(!req.session.userId) req.session.userId = user._id ;
    res.redirect('/admin/products')
})


module.exports = router ;