const mongoose = require('mongoose')
const Schema = mongoose.Schema ;

const productsScehma = new Schema({
    
    cart : {type : Schema.Types.ObjectId , ref : 'Cart'},
    title : { type : String , required : true },
    price : { type : Number , default : 0 },
    image : { type : String , required : true }

} , { timestamps : true })



module.exports = mongoose.model('Product' , productsScehma)