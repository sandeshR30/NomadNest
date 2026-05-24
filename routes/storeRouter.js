const path = require('path');
const express = require('express');
const storeRouter = express.Router();

const rootdir = require('../utils/pathUtils.js');
const {registeredHomes} = require('./hostRouter.js');

const homeController = require('../controller/storeController.js')

storeRouter.get("/",homeController.getIndex);
storeRouter.get("/home/:homeId" , homeController.getHomeDetails);
storeRouter.get("/bookings" , homeController.getBookings);
storeRouter.get("/favourites" , homeController.getFavouriteList);
storeRouter.get("/homes" , homeController.getHomes);

storeRouter.post("/favourites" , homeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:homeId" , homeController.postRemovefromFavourite);






module.exports = storeRouter;