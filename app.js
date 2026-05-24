const path = require('path');

const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const storeRouter = require('./routes/storeRouter.js');
const hostRouter = require('./routes/hostRouter.js');
const errorController = require('./controller/error.js');
const authRouter = require('./routes/authRouter.js');

const DB_PATH = "mongodb+srv://root:root@crowdfunding.yufu7xn.mongodb.net/";  


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


app.use(express.static(path.join(rootdir ,'public')));

app.use((req, res , next)=>{
  console.log(req.url , req.method);
  next();
});

app.use(express.urlencoded());
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

app.use(storeRouter);
app.use("/host",hostRouter);
app.use("/host", (req ,res , next) => {
  if (req.isLoggedIN){
    next();
  }else{
    res.redirect("/login");
  }
});

app.use(authRouter);

app.use(errorController.error);

const port = 3001 ;

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

