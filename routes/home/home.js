const express = require('express');
const router = express.Router(); 
const Product = require('./../../models/product')

router.get('/' , async (req, res)=>{
    let title = 'home page';
    let products =  await Product.find({})

    res.render('./home/home.ejs' , { title , products })
  
})



module.exports = router ;