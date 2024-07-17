const { render } = require('ejs');
const express = require('express') ;
const app = express() ;
const path = require('path') ;
const user = require("./model/user.js") ;
const jwt = require('jsonwebtoken') ;
const bcrypt = require('bcrypt');
const saltRounds = 10;


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/',(req,res)=>{
    res.render("login") ;
}) ;


app.post('/login', async (req,res)=>{

    let {email,password} =  req.body ;
    
    console.log(req.body) ;
    let checkEmail = await user.findOne({email:email}) ;
    console.log(checkEmail) ;
    if(!checkEmail)
    {
        res.send("something went wrong") ;
        return ;
    }

    bcrypt.compare(password, checkEmail, function(err, result) {
        
            let token = jwt.sign({email},"justLearningBackened") ;
            res.cookie("token" , token) ;
            res.render("home") ;
        
    }); 

})

app.get("/create" ,async (req,res)=>{
   
    res.render("create") ;
});
app.post("/info" ,async (req,res)=>{
    
    let {name , email , password , DOB } = req.body ;

    let check = await user.findOne({email}) ;

    if(check)
    {
        res.send("Something went wrong ") ;
        return ; 
    }

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {
            
            
            let person = await user.create({
                    username : name ,
                    password : hash ,
                    email : email ,
                    DOB : DOB 
                }) ;

                let token = jwt.sign({email},"justLearningBackened") ;
                res.cookie("token" , token) ;
                res.render("home") ;
        });
    });
})

app.get("/logout" , (req,res)=>{

    res.cookie("token" ,"") ;
    res.redirect("/") ;
})


app.listen(3000) ;