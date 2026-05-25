const { check, validationResult } = require("express-validator");
const User = require("../model/user")
const bcrypt = require("bcryptjs");

exports.getLogin = (req , res ,next) =>{
  res.render("auth/login", 
    {
      pageTitle: 'Login' ,
      currentPage: 'login' , 
      isLoggedIn: false,
      errors: [],
      oldInput:{}
    })
}

exports.postLogin = async (req , res , next) =>{

  const {email , password} = req.body;
  const user = await User.findOne({email})

  if(!user){
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User doesnt exist"],
      oldInput:{email}
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid Password"],
      oldInput:{email}
    });
  }

  console.log(req.body);
  req.session.isLoggedIn = true;
  req.session.user= user;
  await req.session.save();
  //res.cookie("isLoggedIn" , true);
  res.redirect("/");

}

exports.postLogout = (req , res ,next) =>{
 // res.cookie("isLoggedIn" , false);
 //res.redirect("/login");
 req.session.destroy(()=>{
  res.redirect("/login");
});
}

exports.getsignup = (req , res , next) =>{
  res.render("auth/signup", {pageTitle: 'signup' , currentPage: 'signup' , isLoggedIn: false});
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

  check("role")
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
  const { firstName , lastName , email , password , confirmPassword , role , terms } = req.body;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render("auth/signup",{
      pageTitle: 'signup',
      currentPage: 'signup',
      isLoggedIn: false,
      errors: errors.array().map(err => err.msg),
      oldInput: {firstName , lastName , email , password , role}
    })
  }


  bcrypt.hash(password , 12).then(hashedPassword=>{
    const user = new User({firstName , lastName , email , password: hashedPassword , role})
    return user.save();
  }).then(()=>{
    res.redirect("/login");
  }).catch(err => {
    console.log("error while saving user: ", err);
    return res.status(422).render("auth/signup",{
      pageTitle: 'signup',
      currentPage: 'signup',
      isLoggedIn: false,
      errors: [err.message],
      oldInput: {firstName , lastName , email , password , role}
    })
  })

  

  console.log(req.body);
  
}]