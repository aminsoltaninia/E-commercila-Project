// npm run dev

const express = require('express');
const app = express();
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended:true}) )



app.get('/', (req, res) => {

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

app.post('/' ,(req,res)=>{
    console.log('req.body : ' , req.body)
    res.send('singn up seccess')
})

app.listen(3000, () => {
    console.log('app listen on port 3000 ')
})