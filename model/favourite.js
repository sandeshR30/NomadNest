const mongoose = require('mongoose');
const { Types } = require('mysql2');

const favouriteschema = mongoose.Schema({
  houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Home',
      required: true,
      unique: true
  }
  });

module.exports = mongoose.model('favourite' , favouriteschema);






/* const {ObjectId} = require('mongodb');



module.exports = class Favourites {

  static addToFavourite (homeId) {

    const db = getDb();

    db.collection('homes').find({_id: new ObjectId(String(homeId)) }).next()
      .then(favourite => {
        if (favourite) {
          return db.collection('favourite').insertOne(favourite);
        } else {
          console.log('No home found with the given ID');
          return null;
        }
      })
      .then(() => {
        console.log('Favourite added successfully');
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });

  }
  
  static getFavourites (callback) {

    const db = getDb();
    return db.collection('favourite').find().toArray();
   
 }


  static deleteById(delhomeId) {

    const db = getDb();
    return db.collection('favourite').deleteOne({_id: new ObjectId(String(delhomeId)) });
    
  }

}

 */