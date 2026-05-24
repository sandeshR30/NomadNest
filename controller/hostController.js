const Home = require('../model/store');
const { error } = require('./error');

exports.getAddHome = (req, res , next)=>{
  //console.log(req.url , req.method);
  res.render( 'host/edit-Home' ,  {pageTitle: 'Add Home to Airbnb' ,  currentPage: 'AddHome' , editing: false , isLoggedIn: req.isLoggedIn});

}

exports.postAddHome = (req, res , next)=>{
  console.log(req.body);

  const {houseName , price , location , rating , photoUrl ,description ,id } = req.body;

  const home = new Home({ houseName , price , location , rating , photoUrl ,description  ,id});
  home.save().then(()=>{
    console.log('home saved successfully');
  });

 // registeredHomes.push({houseName: req.body.houseName , pricePerNight: req.body.pricePerNight ,location: req.body.location, rating: req.body.rating, photoUrl: req.body.photoUrl});

  res.render('host/home-added',  {pageTitle: 'Home Added Successfully', currentPage: 'AddHome complete',isLoggedIn: req.isLoggedIn});
}


exports.getHomeDetails = (req ,res , next) =>{
   Home.find().then((registeredHomes)=> res.render('store/home-details', { home : registeredHomes , pageTitle: 'Home page' , currentPage: 'Home'}));
}

exports.getHostHomes = (req, res , next)=>{
  //console.log(req.url , req.method);
 Home.find().then((registeredHomes)=> res.render('host/host-home-list', {registeredHomes: registeredHomes , pageTitle: 'host-Home list' , currentPage: 'host-homes', isLoggedIn: req.isLoggedIn}));
  //console.log(registeredHomes);
 
}

exports.getEditHome = (req, res , next)=>{
  //console.log(req.url , req.method);
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then(home=>{

  

  //Home.findById(homeId , home =>{
    if(!home){
      console.log('home not found for editing');
      return res.redirect('/host/host-home-list');
    }     
    console.log(homeId, editing , home);
    res.render( 'host/edit-Home' ,  {pageTitle: 'Edit Home' ,  currentPage: 'host-home' ,editing: editing , home: home ,isLoggedIn: req.isLoggedIn});
  });
}

exports.postEditHome = (req, res , next)=>{
  console.log(req.body);

  const { houseName , price , location , rating , photoUrl ,description, id } = req.body;

  Home.findById(id).then((home)=>{
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.photoUrl  = photoUrl;
    home.description = description;
    home.save().then(result=>{
    console.log('Home updated', result);
  }).catch(err =>{
    console.log("eror while uploading" , err);
  
  })
  res.redirect('/host/host-home-list');
  }).catch(err =>{
    console.log("error while finding home", err);
  });



  

 // registeredHomes.push({houseName: req.body.houseName , pricePerNight: req.body.pricePerNight ,location: req.body.location, rating: req.body.rating, photoUrl: req.body.photoUrl});

  
};

exports.postDeleteHome = (req , res , next)=>{

  const homeId = req.params.homeId;
  console.log('came to delete the home with id', homeId);

  Home.findByIdAndDelete(homeId).then(()=>{
    res.redirect('/host/host-home-list');
  }).catch(error=>{
    console.log('error while deleting ', error);
  });
  
  /* Home.deleteById(homeId , error =>{
    if(error){
      console.log('error while deleting ', error);
    }
    res.redirect('/host/host-home-list');
  })
 */
}


