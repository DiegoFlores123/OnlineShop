const express = require('express');
const orderController = require('../controllers/orderController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.post('/', authenticateJWT.isLoggedIn, orderController.createOrder);

module.exports = router;
