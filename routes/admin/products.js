const express = require('express')
const fs = require('fs')


const { validationResult } = require('express-validator');
const Product = require('./../../models/product')

const Router = express.Router();
const uplood = require('./../../helpers/uploadImage')
const filetoField = require('./../../validator/filetoField')
// validator 

const productValidator = require('./../../validator/productValidator')
const redirectIfNotAdmin = require('./../../validator/redirectIfNotAdmin');
const { throws } = require('assert');


Router.get('/admin/products', redirectIfNotAdmin.handle, async (req, res) => {
    let title = 'product list'

    let products = await Product.find({})
    res.render('./admin/products.ejs', { title, products })
    //res.render('./admin/products.ejs' , { title })
})

Router.get('/admin/createProducts', redirectIfNotAdmin.handle, (req, res) => {
    let title = 'product create'

    res.render('./admin/create.ejs', { title, messages: req.flash('info') })
})

Router.post('/admin/createProducts', redirectIfNotAdmin.handle, uplood.single('image'),
    filetoField.handle,
    productValidator.handle(),
    async (req, res) => {
        //return res.json(req.body)
        const errors = validationResult(req).array()

        if (errors.length > 0) {

            if (req.file)
                fs.unlink(req.file.path, (err) => {
                    console.log('file nor deleted ')
                })
            let messageError = []
            for (const element of errors) {
                messageError.push(element.msg)
            }
            req.flash('info', messageError)

            return res.redirect('/admin/createProducts')

        }

        let image = `${req.file.destination.substring(8)}/${req.file.originalname}`
        let { title, price } = req.body;
        const newProduct = new Product({
            title, price, image
        })
        await newProduct.save()
        res.redirect('/admin/products');
    })

Router.get('/admin/products/:id/edit', redirectIfNotAdmin.handle, async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    let title = 'edit products'
    res.render('./admin/edit.ejs', { title, product, messages: req.flash('info') })
})

Router.post('/admin/products/:id/edit',
    redirectIfNotAdmin.handle,
    uplood.single('image'),
    filetoField.handle,
    productValidator.handle(),
    async (req, res, next) => {

        const errors = validationResult(req).array()

        if (errors.length > 0) {

            if (req.file)
                fs.unlink(req.file.path, (err) => {
                    console.log('file nor deleted ')
                })
            let messageError = []
            for (const element of errors) {
                messageError.push(element.msg)
            }
            req.flash('info', messageError)

            return res.redirect(`/admin/products/${req.params.id}/edit`)

        }

        let image = `${req.file.destination.substring(8)}/${req.file.originalname}`

        let { title, price } = req.body;

        await Product.findByIdAndUpdate(req.params.id, {
            title, price, image
        })
        res.redirect('/admin/products')
    })


Router.get('/admin/products/:id/delete' ,redirectIfNotAdmin.handle ,async (req,res,next)=>{
       let product = await Product.findById(req.params.id)
       if(!product) return res.redirect('/admin/products')
       await product.remove();
       res.redirect('/admin/products')
})

module.exports = Router;