const { Router } = require("express")
const express = require('express')
const router = express.Router();
const Product = require('./../../models/product')
const Cart = require('./../../models/cart')


router.get('/cart', async (req, res, next) => {
    
    let title = 'card page' 
    if(!req.session.cartId) return res.redirect('/')
    
    let cart = await Cart.findById(req.session.cartId)
    
    for (let element of cart.product) {
        
          const product = await Product.findById(element.productId)
       
          element.product = product ;
    }
    let total = cart.product.reduce((prev , item)=>{
          return prev + item.count * item.product.price
    }, 0 ) 
    res.render('./home/cart.ejs' , { cart , title , total })
    
})

router.post('/cart/products', async (req, res, next) => {
    let cart ;
    if (!req.session.cartId) {
        let productId = req.body.productId;

        const newCart = new Cart({})
        let count = 1;
        newCart.product = [{ productId, count }]

        await newCart.save();

        req.session.cartId = newCart.id;

        return res.redirect('/')

    } else {

        cart = await Cart.findById(req.session.cartId)


    } 
    

    let existinProd = cart.product.find(prod => prod.productId === req.body.productId)

    if (existinProd) {

        existinProd.count++;



    }
    else {



        cart.product.push({ productId: req.body.productId, count: 1 })


    }
   
    await Cart.findByIdAndUpdate(cart.id, {
        product: cart.product
    })

    res.redirect('/')
         


})

router.post('/cart/delete' , async (req,res,next)=>{
  
     let cart = await Cart.findById(req.body.carttId)
     let product = cart.product.filter(item => item.productId !== req.body.productId) 
     console.log(product)
     await Cart.findOneAndUpdate(req.session.carttId , {product})
     res.redirect('/cart')
})


module.exports = router;