
const { check } = require('express-validator');
const path = require('path')

class redirectIfNotAdmin {

    handle(req,res,next) {
         if(req.session.userId) {
             
            next()
         } 
         else if(!req.session.userId){
             
            res.redirect('/signin')
         } 
      
    }
}




module.exports = new redirectIfNotAdmin();