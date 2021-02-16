const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const validator = require("validator");

app.set('view engine', 'ejs');

app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser("enchantment"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }));

app.use(flash());

app.get("/", (req, res) => {

    var nameError = req.flash("nameError");
    var emailError = req.flash("emailError");
    var passwordError = req.flash("passwordError");

    var name = req.flash("name");
    var email = req.flash("email");
    var password = req.flash("password");
    
    nameError = (nameError == undefined || nameError.length == 0) ? undefined : nameError;
    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError;
    passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError;
  
    name = (name == undefined || name.length == 0) ? "" : name;
    email = (email == undefined || email.length == 0) ? "" : email;
    password = (password == undefined || password.length == 0) ? "" : password;

    res.render("index", {nameError, emailError, passwordError, name: name, email: email, password: password});
});

app.post("/form", (req,res) => {
    var {name, email, password} = req.body;

    var nameError;
    var emailError;
    var passwordError;

    if(name == undefined || name == "") {
        nameError = "The name cannot be empty!!";
    }
    if(!validator.isEmail(email)) {
        emailError = "Invalid email!";
        if(email == undefined || email == "") {
            emailError = "The email cannot be empty!";
        } 
    }
    if(password == undefined || password == "") {
        passwordError = "The password cannot be empty!";
    }

    if(nameError != undefined || emailError != undefined || passwordError != undefined){       
        req.flash("nameError", nameError);
        req.flash("emailError", emailError);
        req.flash("passwordError", passwordError);

        req.flash("name", name);
        req.flash("email", email);
        req.flash("password", password);

        res.redirect("/");
    } else {
        res.send("Login successfully!");
    }
});

app.listen(3000, (req,res) => {
    console.log("Server online!");
});