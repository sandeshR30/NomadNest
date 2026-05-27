const { check, validationResult } = require("express-validator");
const User = require("../model/user")
const bcrypt = require("bcryptjs");

exports.getLogin = (req , res ,next) =>{
  res.render("auth/login", {pageTitle: 'Login' , currentPage: 'login' , isLoggedIn: false, user: {}})
}

exports.postLogin = async (req , res , next) =>{
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: {email},
      user: {},
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput: {email},
      user: {},
    });
  }
console.log(req.session);
console.log(req.isLoggedIn);

  req.session.isLoggedIn = true;
  req.session.user = {
    _id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    userType: user.userType
  };

  req.session.save(err => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
}

exports.postLogout = (req , res ,next) =>{
 // res.cookie("isLoggedIn" , false);
 //res.redirect("/login");
 req.session.destroy(()=>{
  res.redirect("/login");
});
}

exports.getsignup = (req , res , next) =>{
  res.render("auth/signup", {pageTitle: 'signup' , currentPage: 'signup' , isLoggedIn: false , user: {}});
}

exports.postsignup = [ 
  check("firstName")
    .notEmpty()
    .withMessage("This field should not be empty")
    .trim()
    .isLength({min: 2})
    .withMessage("first name should be atleast 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("first name can only contain letters"),

  check("lastName")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters"),
  
  check("email")
    .isEmail()
    .withMessage("please enter a valid email")
    .normalizeEmail(),
  
  check("password")
    .isLength({min: 8})
    .withMessage("Password should be atleast 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    .matches(/[!@&]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),
  
  check("confirmPassword")
    .trim()
    .custom((value , {req})=>{
      if(value!== req.body.password){
        throw new Error('password do not match');
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['user', 'host'])
    .withMessage('invalid user type'),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, {req}) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),
  
  (req , res , next) =>{
  const { firstName , lastName , email , password , confirmPassword , userType , terms } = req.body;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render("auth/signup",{
      pageTitle: 'signup',
      currentPage: 'signup',
      isLoggedIn: false,
      errors: errors.array().map(err => err.msg),
      oldInput: {firstName , lastName , email , password , userType},
      user: {}
    })
  }

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({firstName, lastName, email, password: hashedPassword, userType});
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
    }).catch(err => {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: [err.message],
        oldInput: {firstName, lastName, email, userType},
        user: {},
      });
    });

  

  console.log(req.body);
  
}]