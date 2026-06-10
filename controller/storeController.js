//const Favourites = require('../model/favourite');
const Home = require('../model/store');
const User = require('../model/user');
const Booking = require('../model/bookings');

exports.getIndex = (req, res , next)=>{
  //console.log(req.url , req.method);
  console.log("Session Value:", req.session);

  Home.find().then(registeredHomes=>{
    res.render('store/index', {registeredHomes: registeredHomes , pageTitle: 'index page' , currentPage: 'index', isLoggedIn: req.isLoggedIn, user: req.session.user})
  });

  /* Home.find((registeredHomes)=> res.render('store/index', {registeredHomes: registeredHomes , pageTitle: 'index page' , currentPage: 'index'})); */
  //console.log(registeredHomes);
 
}

exports.bookPage = async(req, res, next)=>{

  const homeId = req.params.homeId;
  console.log(homeId);

  res.render("store/bookingPage",
    {pageTitle: 'Booking Page' , 
      currentPage: 'Booking', 
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
      HomeId : homeId,
    });

}



exports.book = async(req, res, next)=>{

  const { checkIn, checkOut } = req.body;

  const homeId = req.params.homeId;
  console.log(homeId, checkIn, checkOut);

  try{

    /* const bookedHomes = await Home.findById(homeId); */

    const Bookings = new Booking({ home: homeId , checkIn: checkIn ,checkOut: checkOut});

    await Bookings.save();

  }catch(error){
    console.log(error);
  }

  res.redirect("/")
};

exports.getHomes = (req, res , next)=>{
  //console.log(req.url , req.method);

  Home.find().then(registeredHomes=>{
    res.render('store/home-list', {registeredHomes: registeredHomes , pageTitle: 'Home list' , currentPage: 'home' ,isLoggedIn: req.isLoggedIn ,user: req.session.user})
  });


  /* Home.find((registeredHomes)=> res.render('store/home-list', {registeredHomes: registeredHomes , pageTitle: 'Home list' , currentPage: 'home'})); */
  //console.log(registeredHomes);
 
}

exports.getHomeDetails = (req ,res , next) =>{
    const homeId = req.params.homeId;
    console.log(homeId);

  Home.findById(homeId).then(home=>{

   
    //Home.findById(homeId , home =>{

      if(!home) {
        console.log("home not found");
        res.redirect("/homes");
      }else{
        res.render('store/home-details', {pageTitle: 'Homes Details page' , currentPage: 'Home' ,home: home ,isLoggedIn: req.isLoggedIn ,user: req.session.user});
      }
    });

    /* Home.find((registeredHomes)=> res.render('store/home-details', { registeredHomes : registeredHomes , pageTitle: 'Homes Details page' , currentPage: 'Home' , homeId : homeId})); */
}

/* exports.getBookings = (req ,res , next) =>{
    Home.find((registeredHomes)=> res.render('store/bookings', { bookings : registeredHomes , pageTitle: 'Bookings page' , currentPage: 'bookings',isLoggedIn: req.isLoggedIn ,user: req.session.user}));
} */

exports.getBookings = async (req , res , next)=>{
  try{
    const registeredHomes = await Home.find();

     res.render('store/bookings', 
      { bookings : registeredHomes , 
        pageTitle: 'Bookings page' , 
        currentPage: 'bookings',
        isLoggedIn: req.isLoggedIn ,
        user: req.session.user
      });
  }catch(err){
    console.log(err);
    next(err)
  }
}

exports.getFavouriteList = async (req, res, next) => {

  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourite')

    res.render("store/favourites", {
    favouritesHomes: user.favourite,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
    });
  /* Favourites.find()
  .populate('houseId')
  .then((favourites) => {
    const favouriteHomes = favourites.map((fav) => fav.houseId);
    res.render("store/favourites", {
      favouritesHomes: favouriteHomes,
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  }); */
};

exports.postAddToFavourite = async(req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if(!user.favourite.includes(homeId)){
    user.favourite.push(homeId);
    await user.save();
  }

 res.redirect("/favourites");

  /*Favourites.findOne({houseId: homeId}).then((fav) => {
    if (fav) {
      console.log("Already marked as favourite");
    } else {
      fav = new Favourites({houseId: homeId});
      fav.save().then((result) => {
        console.log("Fav added: ", result);
      });
    }
    res.redirect("/favourites");
  }).catch(err => {
    console.log("Error while marking favourite: ", err);
  }); */
};

exports.postRemovefromFavourite = async (req ,res , next) =>{
  const homeId = req.params.homeId;
  console.log(homeId);
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if(user.favourite.includes(homeId)){
    user.favourite = user.favourite.filter(fav=> fav != homeId);
    await user.save();
  }

  /* Favourites.findOneAndDelete(homeId).then(()=>{
    res.redirect("/favourites");

  }) */
}
