// npm run dev

const express = require('express');
const app = express();
const authRouther = require('./routes/admin/auth.js')
const home = require('./routes/home/home.js')
const products = require('./routes/admin/products')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const flash = require('connect-flash');
 //  change promis calback to awat and async function




// set config mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ecomerce', { useNewUrlParser: true })


// config express
app.use(express.static('public'))
app.set('views');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())
app.use(cookieSession({
    keys: ['#$jhsgd58;kl8bbh^Gfgdgdemf_)N']
}))
app.use(authRouther);
app.use(home)
app.use(products)

// routers



app.listen(3000, () => {
    console.log('app listen on port 3000 ')
})