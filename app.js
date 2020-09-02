// npm run dev

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt) //  change promis calback to awat and async function

const User = require('./models/user.js')


// set config mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ecomerce', { useNewUrlParser: true })


// config express
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    keys: ['#$jhsgd58;kl8bbh^Gfgdgdemf_)N']
}))

// routers

app.get('/signup', async (req, res) => {

    res.send(`
     <div>
      <form action="" method="POST" >
       <input name ="email" type="email" placeholder="email : ">
       <input  name="password" type="password" placeholder="password : ">
       <input name="passwordConf" type="password" placeholder="password confirmation : ">
       <button type="submit">submit</button>
      </form>
     </div>
   `)
})



// bodyParser.urlencoded([options])
// Returns middleware that only parses urlencoded bodies and only looks at requests
//  where the Content-Type header matches the type option.
//  This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.

// A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
//  This object will contain key-value pairs, where the value can be a string or array (when extended is false), 
//  or any type (when extended is true).

app.post('/signup', async (req, res) => {
    // console.log('req.body : ' , req.body)
    let { email, password, passwordConf } = req.body;
    let user = await User.findOne({ email })
    if (user) return res.send('user is exist , plese inter another email')

    if (password !== passwordConf) return res.send('password and confPassword arnt equal ')
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
    res.send('singn up seccess')
})

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('you are log out ')
})

app.get('/signin', (req, res) => {
    res.send(`  
    <div>
    <form action="" method="POST" >
     <input name ="email" type="email" placeholder="email : ">
     <input  name="password" type="password" placeholder="password : ">
     <button type="submit">submit</button>
    </form>
   </div>
    `)
})

app.post('/signin', async (req, res) => {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send('user not found')
    const [oldPass, salt] = user.password.split('.')

    const supliedPass = await scrypt(password, salt, 64);

    console.log(oldPass, supliedPass, salt)

    if (supliedPass.toString('hex') !== oldPass) return res.send('password is incorect')
    res.send('you are login')
})

app.listen(3000, () => {
    console.log('app listen on port 3000 ')
})