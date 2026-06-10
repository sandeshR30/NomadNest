const path = require('path');

require("dotenv").config();

const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const storeRouter = require('./routes/storeRouter.js');
const hostRouter = require('./routes/hostRouter.js');
const errorController = require('./controller/error.js');
const authRouter = require('./routes/authRouter.js');
const multer = require('multer');

const DB_PATH = process.env.DATABASE_URL;  


const rootdir = require('./utils/pathUtils.js');
//const {mongoConnect} = require('./utils/databaseUtil.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.set('view engine' , 'ejs');
app.set('views' , 'views');

const store = new mongoDBStore({
  uri: DB_PATH,
  collection: 'session',
})

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage(
  {
    destination: (req , file , cb ) =>{
      cb(null , "uploads/");
    },
    filename: (req , file , cb)=>{
      cb(null , randomString(10) + '-' + file.originalname);
    }
  }
)

const fileFilter = (req , file , cb) =>{
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ){
    cb(null , true)
  }else {
    cb(null , false)
  }
}

/* const multerOptions = {
  dest : "uploads/"
} */


app.use(express.static(path.join(rootdir ,'public')));
app.use("/uploads",express.static(path.join(rootdir ,'uploads')));
app.use("/host/uploads",express.static(path.join(rootdir ,'uploads')));



app.use((req, res , next)=>{
  console.log(req.url , req.method);
  next();
});

app.use(express.urlencoded());
app.use(multer({storage: storage}).single('photo'));
app.use(session({
  secret: "Information Technology",
  resave: false,
  saveUninitialized: true,
  store
}))


app.use((req , res , next)=>{
  req.isLoggedIn = req.session.isLoggedIn;
  next();
})

app.use(authRouter);
app.use(storeRouter);

app.use("/host", (req ,res , next) => {
  if (req.isLoggedIn){
    next();
  }else{
    res.redirect("/login");
  }
});

app.use("/host",hostRouter);

app.use(errorController.error);

const port = process.env.PORT;

/* mongoConnect(() =>{
  
  app.listen(port ,()=>{
    console.log(`The server is running at port http://localhost:${port}`);
  });
}); */




mongoose.connect(DB_PATH).then(()=>{
   console.log('connected to mongo');
  app.listen(port ,()=>{
  console.log(`The server is running at port http://localhost:${port}`);
  })
}).catch(err => {
  console.log('Error while connecting to Mongo', err)
});

