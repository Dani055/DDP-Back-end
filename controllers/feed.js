const Car = require('../models/Car');
const User = require('../models/User');
module.exports = {
  getCars: async (req, res, next) => {
    try {
      let filter = req.query.filter;
      let page;
      let multiple;
      let cars = [];

      if(filter === 'all' || !filter){
        cars = await Car.find({status: {$ne: 'завършена & взета'}}).populate('user')
      }
      else if(filter === 'done'){
        cars = await Car.find({ status: {$in: ['завършена & взета']} }).sort({_id: -1}).limit(10).populate('user')
      }
      else if(filter === 'mine'){
        cars = await Car.find({ user: req.userId }).sort({_id: -1}).populate('user')
      }
      
      res.status(200)
        .json({ message: 'Fetched cars successfully.', cars });
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  },
  createCar: async (req, res, next) => {
    try {
      const carObj = req.body;
      let test = await Car.findOne({ brand: carObj.brand, description: carObj.description, isDone: false })
      if (test) {
        const error = new Error("Такава кола вече съществува")
        error.statusCode = 409
        throw error;
      }
      else {
        carObj.user = req.userId
        let car = await Car.create(carObj)
        res.status(200).json({
          message: 'Car created successfully!',
          car
        })

      }
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    };
  },
  getCarById: async (req, res, next) => {
    try {
      const carId = req.params.carId;
      let car = await Car.findById(carId)
      if (car) {
        res.status(200)
          .json({
            message: 'Car fetched successfully!',
            car
          })
      }
      else {
        const error = new Error("Няма такъв обект");
        error.statusCode = 404;
        throw error;
      }
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    };
  },
  getCarByIdAdmin: async (req, res, next) => {
    try {
      const carId = req.params.carId;
      let car = await Car.findById(carId)
      if (car) {
        res.status(200)
          .json({
            message: 'Car fetched successfully!',
            car
          })
      }
      else {
        const error = new Error("Няма такъв обект");
        error.statusCode = 404;
        throw error;
      }
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    };
  },
  editCar: async (req, res, next) => {
    try {
      const carId = req.params.carId;
      let { brand, description, price, status} = req.body;
      let car = await Car.findById(carId)
      if (car) {
        car.brand = brand;
        car.description = description;
        car.price = price;
        car.status = status;

        await car.save()
        res.status(200)
          .json({
            message: 'Car edited successfully!',
            car
          })
      }
      else {
        const error = new Error("Няма такъв обект");
        error.statusCode = 404;
        throw error;
      }

    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    };
  },
  deleteCar: async (req, res) => {
    try {
      const carId = req.params.carId;
      let car = await Car.findById(carId)
      await car.remove()
      res.status(200)
        .json({
          message: 'Car deleted successfully!',
        })
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    };
  },

}