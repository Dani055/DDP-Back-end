const router = require('express').Router();
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const isMechanic = require('../middleware/is-mechanic');


router.get('/cars',isAuth, feedController.getCars);
router.post('/cars/create',isAuth, feedController.createCar);
router.get('/cars/details/:carId',isAuth, feedController.getCarById);
router.get('/cars/edit/:carId',isAuth,isMechanic, feedController.getCarByIdAdmin);
router.post('/cars/edit/:carId', isAuth,isMechanic,feedController.editCar);
router.post('/cars/delete/:carId', isAuth,isMechanic,feedController.deleteCar);

module.exports = router;