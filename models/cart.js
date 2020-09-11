const mongoose = require('mongoose')
const Schema = mongoose.Schema ;


const cartSchema = new Schema({

    product : [ Schema.Types.Mixed ]


} ,{ timestamps : true , toJSON : { virtuals :true }});

cartSchema.virtual('products' , {
    ref : 'Product',
    localField : '_id',
    foreignField : 'cart'
})


module.exports = mongoose.model('Cart' , cartSchema);