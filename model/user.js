const mongoose = require('mongoose') ;

mongoose.connect("mongodb://localhost:27017/usertesting") ;

let user = mongoose.Schema({
    username : String ,
    password : String ,
    email : String ,
    DOB : String 
}) ;


module.exports = mongoose.model("users",user) ;